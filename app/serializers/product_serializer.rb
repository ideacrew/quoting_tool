class ProductSerializer
  include FastJsonapi::ObjectSerializer

  attributes :deductible, :name

  attribute :available_packages, &:product_package_kinds
  attribute :group_deductible, &:family_deductible
  attribute :network, &:network_information

  attribute :hospital_stay do |object|
    object.hospital_stay_in_network_copay.split(" ")[0].gsub("$","")
  end

  attribute :emergency_stay do |object|
    object.emergency_in_network_copay.split(" ")[0].gsub("$","")
  end

  attribute :pcp_office_visit do |object|
    object.pcp_in_network_copay.split(" ")[0].gsub("$","")
  end

  attribute :rx do |object|
    object.drug_in_network_copay.split(" ")[0].gsub("$","")
  end

  attribute :hsa_eligible do |object|
    nil
  end

  attribute :integrated_drug_deductible do |object|
    nil
  end

  attribute :product_type do |object|
    object.health? ? object.health_plan_kind : object.dental_plan_kind
  end

  attribute :provider_name do |object|
    nil
  end

  attribute :sic_code_factor do |object, params|
    factor = Products::ActuarialFactors::SicActuarialFactor.where(:"active_year" => object.active_year, :"issuer_hios_id".in => object.issuer_hios_ids).first
    entry = factor.actuarial_factor_entries.where(factor_key: params[:sic]).first if factor
    entry.blank? ? 1.0 : entry.factor_value
  end

  attribute :group_size_factors do |object|
    Rails.cache.fetch("group_size_factors_#{object.issuer_hios_ids}", expires_in: 45.minutes) do
      factor = Products::ActuarialFactors::GroupSizeActuarialFactor.where(:"active_year" => object.active_year, :"issuer_hios_id".in => object.issuer_hios_ids).first

      output = factor.actuarial_factor_entries.inject({}) do |result, afe|
        result[afe.factor_key] = afe.factor_value
        result
      end

      {:factors => output, :max_group_size => factor.max_integer_factor_key}
    end
  end

  attribute :group_tier_factors do |object|
    Rails.cache.fetch("group_tier_factors_#{object.issuer_hios_ids}", expires_in: 45.minutes) do
      factor = Products::ActuarialFactors::CompositeRatingTierActuarialFactor.where(:"active_year" => object.active_year, :"issuer_hios_id".in => object.issuer_hios_ids).first

      tf_name_map = {
        "employee_only" => "Employee Only",
        "employee_and_spouse" => "Employee and Spouse",
        "employee_and_one_or_more_dependents" => "Employee and Dependents",
        "family" => "Family"
      }

      factor.actuarial_factor_entries.inject([]) do |result, afe|
        key = tf_name_map[afe.factor_key]
        result << {factor: afe.factor_value, name: key}
        result
      end
    end
  end

  attribute :participation_factors do |object|
    Rails.cache.fetch("participation_factors_#{object.issuer_hios_ids}", expires_in: 45.minutes) do
      factor = Products::ActuarialFactors::ParticipationRateActuarialFactor.where(:"active_year" => object.active_year, :"issuer_hios_id".in => object.issuer_hios_ids).first

      factor.actuarial_factor_entries.inject({}) do |result, afe|
        result[afe.factor_key] = afe.factor_value
        result
      end
    end
  end

  attribute :rates do |object, params|
    Rails.cache.fetch("rates_#{params[:rating_area_id]}", expires_in: 45.minutes) do
      pt = object.premium_tables.where(rating_area_id: params[:rating_area_id]).first

      output = pt.premium_tuples.inject({}) do |result, tuple|
        result[tuple.age] = tuple.cost
        result
      end
      {entries: output, max_age: object.premium_ages.max, min_age: object.premium_ages.min}
    end
  end
end
