# frozen_string_literal: true

# Support product import from SERFF, CSV templates, etc

# Effective dates during which sponsor may purchase this product at this price
## DC SHOP Health   - annual product changes & quarterly rate changes
## CCA SHOP Health  - annual product changes & quarterly rate changes
## DC IVL Health    - annual product & rate changes
## Medicare         - annual product & semiannual rate changes

module Products
  # Product
  class Product
    include Mongoid::Document
    include Mongoid::Timestamps

    BENEFIT_MARKET_KINDS = %i[aca_shop aca_individual fehb medicaid medicare].freeze

    field :benefit_market_kind,   type: Symbol

    # Time period during which Sponsor may include this product in benefit application
    field :application_period,    type: Range # => Mon, 01 Jan 2018..Mon, 31 Dec 2018

    field :hbx_id,                type: String
    field :title,                 type: String
    field :description,           type: String,         default: ''
    field :issuer_hios_ids,       type: Array,          default: []
    field :product_package_kinds, type: Array,          default: []
    field :kind,                  type: Symbol,         default: -> { product_kind }
    field :premium_ages,          type: Range,          default: 0..65
    field :provider_directory_url,      type: String
    field :is_reference_plan_eligible,  type: Boolean, default: false

    field :deductible, type: String
    field :family_deductible, type: String
    field :issuer_assigned_id, type: String
    field :service_area_id, type: BSON::ObjectId
    field :network_information, type: String

    field :group_size_factors, type: Hash
    field :group_tier_factors, type: Array
    field :participation_factors, type: Hash
    field :hsa_eligible, type: Boolean

    field :out_of_pocket_in_network, type: String

    embeds_one  :sbc_document,
                class_name: 'Documents::Document', as: :documentable

    embeds_many :premium_tables,
                class_name: '::Products::PremiumTable'

    # validates_presence_of :hbx_id
    validates_presence_of :application_period, :benefit_market_kind, :title, :service_area

    validates :benefit_market_kind,
              presence: true,
              inclusion: { in: BENEFIT_MARKET_KINDS, message: '%{value} is not a valid benefit market kind' }

    index({ hbx_id: 1 }, name: 'products_hbx_id_index')
    index({ service_area_id: 1 }, name: 'products_service_area_index')

    index({ 'application_period.min' => 1,
            'application_period.max' => 1 },
          name: 'products_application_period_index')

    index({ 'benefit_market_kind' => 1,
            'kind' => 1,
            'product_package_kinds' => 1 },
          name: 'product_market_kind_product_package_kind_index')

    index({ 'premium_tables.effective_period.min' => 1,
            'premium_tables.effective_period.max' => 1 },
          name: 'products_premium_tables_effective_period_index')

    index({ 'benefit_market_kind' => 1,
            'kind' => 1,
            'product_package_kinds' => 1,
            'application_period.min' => 1,
            'application_period.max' => 1 },
          name: 'products_product_package_date_search_index')

    index({ 'premium_tables.rating_area' => 1,
            'premium_tables.effective_period.min' => 1,
            'premium_tables.effective_period.max' => 1 },
          name: 'products_premium_tables_search_index')

    scope :by_product_package, lambda { |product_package|
                                 by_application_period(product_package.application_period).where(
                                   :benefit_market_kind => product_package.benefit_kind,
                                   :kind => product_package.product_kind,
                                   :product_package_kinds.in => [product_package.package_kind]
                                 )
                               }

    scope :aca_shop_market,             -> { where(benefit_market_kind: :aca_shop) }
    scope :aca_individual_market,       -> { where(benefit_market_kind: :aca_individual) }
    scope :by_kind,                     ->(kind) { where(kind: kind) }
    scope :by_service_area,             ->(service_area) { where(service_area: service_area) }
    scope :by_service_areas,            ->(service_area_ids) { where('service_area_id' => { '$in' => service_area_ids }) }

    scope :by_metal_level_kind,         ->(metal_level) { where(metal_level_kind: /#{metal_level}/i) }

    scope :effective_with_premiums_on,  lambda  { |effective_date|
                                          where(:"premium_tables.effective_period.min".lte => effective_date,
                                                :"premium_tables.effective_period.max".gte => effective_date)
                                        }

    # input: application_period type: :Date
    # ex: application_period --> [2018-02-01 00:00:00 UTC..2019-01-31 00:00:00 UTC]
    #     BenefitProduct avilable for both 2018 and 2019
    # output: might pull multiple records
    scope :by_application_period,       lambda  { |application_period|
      where(
        '$or' => [
          { 'application_period.min' => { '$lte' => application_period.max, '$gte' => application_period.min } },
          { 'application_period.max' => { '$lte' => application_period.max, '$gte' => application_period.min } },
          { 'application_period.min' => { '$lte' => application_period.min }, 'application_period.max' => { '$gte' => application_period.max } }
        ]
      )
    }

    # Products retrieval by type
    scope :health_products,            -> { where("_type": /.*HealthProduct$/) }
    scope :dental_products,            -> { where("_type": /.*DentalProduct$/) }

    # Highly nested scopes don't behave in a way I entirely understand with
    # respect to the $elemMatch operator.  Since we are only invoking this
    # method when we already have the document, I'm going to abuse lazy
    # enumeration to create something that behaves like a scope but will
    # only be evaluated once.
    def self.by_coverage_date(collection, coverage_date)
      collection.select do |product|
        product.premium_tables.any? do |pt|
          (pt.effective_period.min <= coverage_date) && (pt.effective_period.max >= coverage_date)
        end
      end
    end

    def service_area_id=(val)
      write_attribute(:service_area_id, val)
      @service_area = if val.nil?
                        nil
                      else
                        ::Locations::ServiceArea.find(service_area_id)
                      end
    end

    def service_area=(val)
      @service_area = val
      if val.nil?
        write_attribute(:service_area_id, nil)
      else
        write_attribute(:service_area_id, val.id)
      end
    end

    def ehb
      percent = read_attribute(:ehb)
      percent&.positive? ? percent : 1
    end

    def service_area
      return nil if service_area_id.blank?

      @service_area ||= ::Locations::ServiceArea.find(service_area_id)
    end

    def name
      title
    end

    def min_cost_for_application_period(effective_date)
      p_tables = premium_tables.effective_period_cover(effective_date)
      return unless premium_tables.any?

      p_tables.flat_map(&:premium_tuples).select do |pt|
        pt.age == premium_ages.min
      end.min_by(&:cost).cost
    end

    def max_cost_for_application_period(effective_date)
      p_tables = premium_tables.effective_period_cover(effective_date)
      return unless premium_tables.any?

      p_tables.flat_map(&:premium_tuples).select do |pt|
        pt.age == premium_ages.min
      end.max_by(&:cost).cost
    end

    def cost_for_application_period(application_period)
      p_tables = premium_tables.effective_period_cover(application_period.min)
      return unless premium_tables.any?

      p_tables.flat_map(&:premium_tuples).select do |pt|
        pt.age == premium_ages.min
      end.min_by(&:cost).cost
    end

    def deductible_value
      return nil if deductible.blank?

      deductible.split('.').first.gsub(/[^0-9]/, '').to_i
    end

    def family_deductible_value
      return nil if family_deductible.blank?

      deductible.split('|').last.split('.').first.gsub(/[^0-9]/, '').to_i
    end

    def product_kind
      kind_string = self.class.to_s.demodulize.sub!('Product', '').downcase
      kind_string.present? ? kind_string.to_sym : :product_base_class
    end

    def comparable_attrs
      %i[
        hbx_id benefit_market_kind application_period title description
        issuer_profile_id service_area
      ]
    end

    # Define Comparable operator
    # If instance attributes are the same, compare PremiumTables
    def <=>(other)
      if comparable_attrs.all? { |attr| send(attr) == other.send(attr) }
        if premium_tables.count != other.premium_tables.count
          premium_tables.count <=> other.premium_tables.count
        else
          premium_tables.to_a <=> other.premium_tables.to_a
        end
      else
        other.updated_at.blank? || (updated_at < other.updated_at) ? -1 : 1
      end
    end

    def active_year
      application_period.min.year
    end

    def premium_table_effective_on(effective_date)
      premium_tables.detect { |premium_table| premium_table.effective_period.cover?(effective_date) }
    end

    # Add premium table, covering extended time period, to existing product.  Used for products that
    # have periodic rate changes, such as ACA SHOP products that are updated quarterly.
    def add_premium_table(new_premium_table)
      raise InvalidEffectivePeriodError unless valid_premium_table_effective_period?(new_premium_table)

      if premium_table_effective_on(new_premium_table.effective_period.min).present? ||
         premium_table_effective_on(new_premium_table.effective_period.max).present?
        raise DuplicatePremiumTableError, 'effective_period may not overlap existing premium_table'
      else
        premium_tables << new_premium_table
      end

      self
    end

    def update_premium_table(updated_premium_table)
      raise InvalidEffectivePeriodError unless valid_premium_table_effective_period?(updated_premium_table)

      drop_premium_table(premium_table_effective_on(updated_premium_table.effective_period.min))
      add_premium_table(updated_premium_table)
    end

    def drop_premium_table(premium_table)
      premium_tables.delete(premium_table) unless premium_table.blank?
    end

    def valid_premium_table_effective_period?(compare_premium_table)
      return false unless application_period.present? && compare_premium_table.effective_period.present?

      if application_period.cover?(compare_premium_table.effective_period.min) &&
         application_period.cover?(compare_premium_table.effective_period.max)
        true
      else
        false
      end
    end

    def add_product_package(new_product_package)
      product_packages.push(new_product_package).uniq!
      product_packages
    end

    def drop_product_package(product_package)
      product_packages.delete(product_package) { 'not found' }
    end

    def health?
      kind == :health
    end

    def dental?
      kind == :dental
    end
  end
end
