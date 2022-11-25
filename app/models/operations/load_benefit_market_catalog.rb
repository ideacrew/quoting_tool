# frozen_string_literal: true

require 'dry/monads'
require 'dry/monads/do'
module Operations
  class LoadBenefitMarketCatalog
    include Dry::Monads[:result, :do]

    def call(input)
      country_zips   = yield load_county_zips(input)
      rating_areas   = yield load_rating_areas(input)
      rating_factors = yield load_rating_factors(input)
      service_areas  = yield load_service_areas(input)
      plans          = yield load_plans(input)
      rates          = yield load_rates(input)
    end

    private

    def load_county_zips(input)
      Rails.logger.debug ':: Loading County Zip records ::'
      files = Rails.root.glob("db/seedfiles/plan_xmls/#{input[:state]}/xls_templates/counties/**/*.xlsx")
      parsed_files = parse_files(files)
      parsed_files.each do |file|
        ::Operations::LoadCountyZip.new.call(file)
      end
      Rails.logger.debug ':: Finished Loading County Zip records ::'
      Success(input)
    end

    def load_rating_areas(input)
      Rails.logger.debug ':: Loading Rating Area records ::'
      files = Rails.root.glob("db/seedfiles/plan_xmls/#{input[:state]}/xls_templates/rating_areas/**/*.xlsx")
      parsed_files = parse_files(files)
      parsed_files.each do |file|
        ::Operations::LoadRatingAreas.new.call(file)
      end
      Rails.logger.debug ':: Finished Loading Rating Area records ::'
      Success(input)
    end

    def load_rating_factors(input)
      Rails.logger.debug ':: Loading County Rating Factor ::'
      files = Rails.root.glob("db/seedfiles/plan_xmls/#{input[:state]}/xls_templates/rating_factors/**/*.xlsx")
      parsed_files = parse_files(files)
      parsed_files.each do |file|
        ::Operations::LoadFactors.new.call(file)
      end
      Rails.logger.debug ':: Finished Loading Rating Factor records ::'
      Success(input)
    end

    def load_service_areas(input)
      Rails.logger.debug ':: Loading Service Areas ::'
      files = Rails.root.glob("db/seedfiles/plan_xmls/#{input[:state]}/xls_templates/service_areas/**/*.xlsx")
      parsed_files = parse_files(files)
      parsed_files.each do |file|
        ::Operations::LoadServiceAreas.new.call(file)
      end
      Rails.logger.debug ':: Finished Loading Service Areas ::'
      Success(input)
    end

    def load_plans(input)
      Rails.logger.debug ':: Loading Plans ::'
      files = Dir.glob(Rails.root.join('db/seedfiles/plan_xmls', input[:state], 'plans', '**', '*.xml'))
      parsed_files = parse_files(files)
      additional_files = Rails.root.glob("db/seedfiles/plan_xmls/#{input[:state]}/master_xml/**/*.xlsx")

      parsed_files = parse_files(files)
      parsed_additional_files = parse_files(additional_files)

      transaction = Transactions::LoadPlans.new
      transaction.with_step_args(
        load_file_info: [parsed_additional_files]
      ).call(parsed_files)
      Rails.logger.debug ':: Finished Loading Plans ::'
      Success(input)
    end

    def load_rates(input)
      Rails.logger.debug ':: Loading Rates ::'
      files = Dir.glob(Rails.root.join('db/seedfiles/plan_xmls', input[:state], 'rates', '**', '*.xml'))
      parsed_files = parse_files(files)
      ::Operations::LoadRates.new.call(parsed_files)
      Rails.logger.debug ':: Finished Loading Rates ::'
      Success(input)
    end

    def parse_files(files)
      files.map { |f| f.gsub!('~$', '') || f }.uniq
    end
  end
end
