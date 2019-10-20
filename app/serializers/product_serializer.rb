class ProductSerializer
  include FastJsonapi::ObjectSerializer

  ProviderMap = {
    "36046" => "Harvard Pilgrim Health Care",
    "80538" => "Delta Dental",
    "11821" => "Delta Dental",
    "31779" => "UnitedHealthcare",
    "29125" => "Tufts Health Premier",
    "88806" => "Fallon Health",
    "52710" => "Fallon Health",
    "41304" => "AllWays Health Partners",
    "18076" => "Altus Dental",
    "34484" => "Health New England",
    "59763" => "Tufts Health Direct",
    "42690" => "Blue Cross Blue Shield MA",
    "82569" => "BMC HealthNet Plan"
  }

  attributes :deductible, :name, :group_size_factors, :group_tier_factors, :participation_factors, :hsa_eligible

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

  attribute :metal_level do |object|
    object.metal_level_kind
  end

  attribute :integrated_drug_deductible do |object|
    nil
  end

  attribute :product_type do |object|
    object.health? ? object.health_plan_kind : object.dental_plan_kind
  end

  attribute :provider_name do |object|
    ProviderMap[object.issuer_hios_ids.first]
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
