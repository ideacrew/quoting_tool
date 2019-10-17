class ProductSerializer
  include FastJsonapi::ObjectSerializer

  attributes :deductible, :name, :group_size_factors, :group_tier_factors, :participation_factors

  attribute :available_packages, &:product_package_kinds
  attribute :group_deductible, &:family_deductible
  attribute :network, &:network_information

  attribute :hospital_stay do |object|
    object.health? ? object.hospital_stay_in_network_copay : nil
  end

  attribute :emergency_stay do |object|
    object.health? ? object.emergency_in_network_copay : nil
  end

  attribute :pcp_office_visit do |object|
    object.health? ? object.pcp_in_network_copay : nil
  end

  attribute :rx do |object|
    object.health? ? object.drug_in_network_copay : nil
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
    $sic_factors[[params[:sic], object.active_year, object.issuer_hios_ids.first]] || 1.0
  end

  attribute :rates do |object, params|
    Rails.cache.fetch("rates_#{object.id}_#{params[:rating_area_id]}", expires_in: 45.minutes) do
      $rates[[object.id, params[:rating_area_id]]]
    end
  end
end
