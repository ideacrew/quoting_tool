# frozen_string_literal: true

module Parsers
  module Products
    # Parser for Package Lists
    class PackageListParser
      include HappyMapper

      tag 'packagesList'

      has_many :packages, PackageParser, tag: 'packages'

      def to_hash
        {
          packages: packages.map(&:to_hash)
        }
      end
    end
  end
end
