module Validations
  class CensusRecordValidator < Dry::Validation::Contract

    params do
      required(:dob)
      required(:employee_relationship).filled(:string)
    end

    rule(:dob) do
      if !value.is_a?(Date)
        key.failure('is Invalid')
      end
    end
  end
end
