class ProductSerializer
  include FastJsonapi::ObjectSerializer

  attributes :deductible, :name, :group_size_factors, :group_tier_factors, :participation_factors

  attribute :available_packages, &:product_package_kinds
  attribute :group_deductible, &:family_deductible
  attribute :network, &:network_information

  attribute :hospital_stay do |object|
    object.hospital_stay_in_network_copay
  end

  attribute :emergency_stay do |object|
    object.emergency_in_network_copay
  end

  attribute :pcp_office_visit do |object|
    object.pcp_in_network_copay
  end

  attribute :rx do |object|
    object.drug_in_network_copay
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
    return 1 if factor.blank?
    entry = factor.actuarial_factor_entries.where(factor_key: params[:sic]).first
    entry.blank? ? 1.0 : entry.factor_value
  end

  attribute :rates do |object, params|
    Rails.cache.fetch("rates_#{object.id}_#{params[:rating_area_id]}", expires_in: 45.minutes) do
      $rates[[object.id, params[:rating_area_id]]]
      # pt = object.premium_tables.where(rating_area_id: params[:rating_area_id]).first

      # output = pt.premium_tuples.inject({}) do |result, tuple|
      #   result[tuple.age] = tuple.cost
      #   result
      # end
      # {entries: output, max_age: object.premium_ages.max, min_age: object.premium_ages.min}
    end
  end
end
