# frozen_string_literal: true

module Parsers
  module Products
    # Parser for Plan Benefits Template
    class PlanBenefitTemplateParser
      include HappyMapper

      tag 'planBenefitTemplateVO'

      has_one :packages_list, PackageListParser, tag: 'packagesList'

      def to_hash
        {
          packages_list: packages_list.to_hash
        }
      end
    end
  end
end
