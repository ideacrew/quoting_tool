# frozen_string_literal: true

module Products
  module ActuarialFactors
    # GroupSizeActuarialFactor
    class GroupSizeActuarialFactor < ActuarialFactor
      validates_numericality_of :max_integer_factor_key, allow_blank: false

      def self.value_for(issuer_hios_id, year, val)
        record = where(issuer_hios_id: issuer_hios_id, active_year: year).first
        record.lookup(val)
      end

      # Upper bound by max integer key, and lower bound by
      # 1 - group size can't be smaller
      def lookup(val)
        max_adjusted_key = val > max_integer_factor_key ? max_integer_factor_key : val
        lookup_key = val < 1 ? 1 : max_adjusted_key
        super(lookup_key.to_s)
      end

      def cached_lookup(lookup_key)
        max_adjusted_key = lookup_key > max_integer_factor_key ? max_integer_factor_key : lookup_key
        lookup_key = lookup_key < 1 ? 1 : max_adjusted_key
        super(lookup_key.to_s)
      end
    end
  end
end
