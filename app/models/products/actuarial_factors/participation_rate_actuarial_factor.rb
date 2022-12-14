# frozen_string_literal: true

module Products
  module ActuarialFactors
    # ParticipationRateActuarialFactor
    class ParticipationRateActuarialFactor < ActuarialFactor
      def self.value_for(issuer_hios_id, year, val)
        record = where(issuer_hios_id: issuer_hios_id, active_year: year).first
        record.lookup(val)
      end

      # Expects a number out of 100, NOT a fraction out of 1.
      # 97.1234 is OK, 0.971234 is NOT
      def lookup(val)
        rounded_value = val.respond_to?(:round) ? val.round : val
        transformed_value = rounded_value < 1 ? 1 : rounded_value
        super(transformed_value.to_s)
      end

      def cached_lookup(val)
        rounded_value = val.respond_to?(:round) ? val.round : val
        transformed_value = rounded_value < 1 ? 1 : rounded_value
        super(transformed_value.to_s)
      end
    end
  end
end
