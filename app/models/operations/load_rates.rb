# frozen_string_literal: true
require 'dry/monads'
require 'dry/monads/do'

module Operations
  class LoadRates
    include Dry::Monads[:result, :do]

    def call(input_xml_files)
      validated_result = yield validate_and_load_xml_files(input_xml_files)
      file_data = yield load_file_data(validated_result)
      created_records = yield create_records(file_data)
      Success(created_records)
    end

    private

    def validate_and_load_xml_files(input_xml_files)
      loaded_xml_files = []
      input_xml_files.each do |file|
        loaded_xml_file = Nokogiri::XML(File.open(file))
        return Failure(message: "Invalid XML file upon loading rates - #{file}") if loaded_xml_file.errors.present?

        loaded_xml_files << loaded_xml_file
      end
      Success(loaded_xml_files: loaded_xml_files)
    end

    def load_file_data(validated_result)
      output = validated_result[:loaded_xml_files].inject([]) do |result, xml|
        product_hash = Parsers::Products::PlanRateGroupListParser.parse(xml.root.canonicalize, single: true).to_hash
        result += product_hash[:plan_rate_group_attributes]
      end
      Success(result: output)
    end

    def create_records(input)
      Operations::RateBuilder.new.call(rate_groups: input[:result], rating_area_map: rating_area_map)
      Success(message: 'Rates Succesfully Loaded')
    end

    def rating_area_map
      @rating_area_map = {}
      ::Locations::RatingArea.all.map do |ra|
        @rating_area_map[[ra.active_year, ra.exchange_provided_code]] = ra.id
      end
      @rating_area_map
    end

    def parse_text(input)
      return nil if input.nil?

      input.squish!
    end

    def parse_boolean(value)
      value = parse_text(value)
      return true   if value == true   || value =~ /(true|t|yes|y|1)$/i
      return false  if value == false  || value =~ /(false|f|no|n|0)$/i

      nil
    end

    def parse_url(input)
      return nil if input.nil?
      return input if input.include?('http')

      "http://#{input}"
    end
  end
end
