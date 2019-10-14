module Products
  module ActuarialFactors
    class SicActuarialFactor < ActuarialFactor
      def self.value_for(issuer_hios_id, year, val)
        record = self.where(issuer_hios_id: issuer_hios_id, active_year: year).first
        record.lookup(val)
      end
    end
  end
end
