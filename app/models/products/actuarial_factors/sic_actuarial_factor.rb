# frozen_string_literal: true

module Products
  module ActuarialFactors
    # SicActuarialFactor
    class SicActuarialFactor < ActuarialFactor
      def self.value_for(issuer_hios_id, year, val)
        record = where(issuer_hios_id: issuer_hios_id, active_year: year).first
        record.lookup(val)
      end
    end
  end
end
