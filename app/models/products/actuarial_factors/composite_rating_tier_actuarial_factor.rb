module Products
  module ActuarialFactors
    class CompositeRatingTierActuarialFactor < ActuarialFactor
      def self.value_for(issuer_hios_id, year, val)
        record = self.where(issuer_hios_id: issuer_hios_id, active_year: year).first
        if record.present?
          record.lookup(val)
        else
          logger.error "Lookup for #{val} failed with no FactorSet found: Issuer: #{carrier_profile_id}, Year: #{year}"
          1.0
        end
      end
    end
  end
end
