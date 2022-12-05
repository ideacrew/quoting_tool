# frozen_string_literal: true

module Products
  # HealthProduct
  class HealthProduct < Product
    PRODUCT_PACKAGE_KINDS = %i[single_issuer metal_level single_product].freeze
    METAL_LEVEL_KINDS     = %i[bronze silver gold platinum catastrophic].freeze

    HEALTH_PLAN_MAP = {
      hmo: 'Health Maintenance Organization', # designated primary care physician (PCP) who's
      #   referral is required for specialists who are in-network
      ppo: 'Preferred provider Organization', # health plan with a 'preferred' network of providers
      #   in an area
      pos: 'Point of Service', # hmo/ppo hybrid. PCP referral for specialist required.
      #   In-network providers are lower cost, may access out-of-network
      #   providers at higher cost
      epo: 'Exclusive Provider Network' # hmo/ppo hybrid. PCP referral for specialist not required, but
      #   must pay out-of-pocket for doctors outside network
    }.freeze

    field :hios_id,                     type: String
    field :hios_base_id,                type: String
    field :csr_variant_id,              type: String

    field :health_plan_kind,            type: Symbol # => :hmo, :ppo, :pos, :epo
    field :metal_level_kind,            type: Symbol

    # Essential Health Benefit (EHB) percentage
    field :ehb,                         type: Float,    default: 0.0
    field :is_standard_plan,            type: Boolean,  default: false

    field :rx_formulary_url,            type: String
    field :hsa_eligibility,             type: Boolean, default: false
    field :network_information,         type: String

    # Visits #co-pay
    field :pcp_in_network_copay,             type: String
    field :hospital_stay_in_network_copay,   type: String
    field :emergency_in_network_copay,       type: String
    field :drug_in_network_copay,            type: String

    # Visits #co-insurance
    field :pcp_in_network_co_insurance,             type: String
    field :hospital_stay_in_network_co_insurance,   type: String
    field :emergency_in_network_co_insurance,       type: String
    field :drug_in_network_co_insurance,            type: String

    validates_presence_of :hios_id, :health_plan_kind, :ehb

    validates_numericality_of :ehb, greater_than: 0.0, less_than_or_equal_to: 1.0, allow_nil: false

    validate :product_package_kinds

    index({ hios_id: 1, "active_period.min": 1, "active_period.max": 1, name: 1 }, name: 'products_health_product_hios_active_period_name_index')
    index({ "active_period.min": 1, "active_period.max": 1, market: 1, coverage_kind: 1, nationwide: 1, name: 1 }, name: 'health_products_a_period_market_c_kind_nationwide_name_index')
    index({ csr_variant_id: 1 }, sparse: true, name: 'product_health_products_csr_variant_index')

    scope :standard_plans,      -> { where(is_standard_plan: true) }

    scope :ppo_plans,           -> { where(health_plan_kind: :ppo) }
    scope :pos_plans,           -> { where(health_plan_kind: :pos) }
    scope :hmo_plans,           -> { where(health_plan_kind: :hmo) }
    scope :epo_plans,           -> { where(health_plan_kind: :epo) }

    scope :bronze_plans,        -> { where(metal_level_kind: :bronze) }
    scope :silver_plans,        -> { where(metal_level_kind: :silver) }
    scope :gold_plans,          -> { where(metal_level_kind: :gold) }
    scope :platinum_plans,      -> { where(metal_level_kind: :platinum) }
    scope :catastrophic_plans,  -> { where(metal_level_kind: :catastrophic) }

    validates :health_plan_kind,
              presence: true,
              inclusion: { in: HEALTH_PLAN_MAP.keys, message: '%{value} is not a valid health product kind' }

    validates :metal_level_kind,
              presence: true,
              inclusion: { in: METAL_LEVEL_KINDS, message: '%{value} is not a valid metal level kind' }

    alias is_standard_plan? is_standard_plan
    alias is_reference_plan_eligible? is_reference_plan_eligible

    def metal_level
      metal_level_kind.to_s
    end

    def product_type
      health_plan_kind.to_s
    end

    private

    def validate_product_package_kinds
      errors.add(:product_package_kinds, :invalid) if !product_package_kinds.is_a?(Array) || product_package_kinds.detect { |pkg| !PRODUCT_PACKAGE_KINDS.include?(pkg) }
    end
  end
end
