module Operations
  class ProductBuilder
    include Dry::Transaction::Operation

    attr_accessor :qhp

    def call(params)
      @qhp = params[:qhp]
      @qhp.qhp_cost_share_variances.each do |cost_share_variance|
        hios_base_id, csr_variant_id = cost_share_variance.hios_plan_and_variant_id.split("-")
        next if csr_variant_id == "00"
        csr_variant_id = retrieve_metal_level == "dental" ? "" : csr_variant_id
        product = ::Products::Product.where(
          :"hios_base_id" => hios_base_id,
          :"csr_variant_id" => csr_variant_id,
          :"application_period.min".gte => Date.new(qhp.active_year, 1, 1), :"application_period.min".lte => Date.new(qhp.active_year, 1, 1).end_of_year
        ).first

        shared_attrs ={
          benefit_market_kind: "aca_#{parse_market}",
          title: cost_share_variance.plan_marketing_name.squish!,
          hios_id: is_health_product? ? cost_share_variance.hios_plan_and_variant_id : hios_base_id,
          hios_base_id: hios_base_id,
          csr_variant_id: csr_variant_id,
          application_period: (Date.new(qhp.active_year, 1, 1)..Date.new(qhp.active_year, 12, 31)),
          service_area_id: params[:service_area_map][[qhp.issuer_id, qhp.service_area_id, qhp.active_year]],
          deductible: cost_share_variance.qhp_deductable.in_network_tier_1_individual,
          family_deductible: cost_share_variance.qhp_deductable.in_network_tier_1_family,
          is_reference_plan_eligible: true,
          metal_level_kind: retrieve_metal_level.to_sym,
        }

        attrs = if is_health_product?
          {
            health_plan_kind: qhp.plan_type.downcase,
            ehb: qhp.ehb_percent_premium.present? ? qhp.ehb_percent_premium : 1.0
          }
        else
          {
            dental_plan_kind: qhp.plan_type.downcase,
            dental_level: qhp.metal_level.downcase,
            product_package_kinds: ::Products::DentalProduct::PRODUCT_PACKAGE_KINDS
          }
        end.merge(shared_attrs)

        if product.present?
          product.issuer_hios_ids += qhp.issuer_id
          product.issuer_hios_ids = product.issuer_hios_ids.uniq
          product.update_attributes!(attrs)
        else
          attrs.merge!({issuer_hios_ids: [qhp.issuer_id]})
          new_product = if is_health_product?
            ::Products::HealthProduct.new(attrs)
          else
            ::Products::DentalProduct.new(attrs)
          end

          if new_product.save!
            cost_share_variance.product_id = new_product.id
          end
        end
      end
    end

    def retrieve_metal_level
      is_health_product? ? qhp.metal_level.downcase : "dental"
    end

    def is_health_product?
      qhp.dental_plan_only_ind.downcase == "no"
    end

    def parse_market
      qhp.market_coverage = qhp.market_coverage.downcase.include?("shop") ? "shop" : "individual"
    end
  end
end
