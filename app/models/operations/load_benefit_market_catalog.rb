# frozen_string_literal: true

require 'dry/monads'
require 'dry/monads/do'
module Operations
  # This class is to load benefit market catalog
  class LoadBenefitMarketCatalog
    include Dry::Monads[:result, :do]

    def call(input)
      yield load_county_zips(input)
      yield load_rating_areas(input)
      yield load_rating_factors(input)
      yield load_service_areas(input)
      yield load_plans(input)
      yield load_rates(input)
    end

    private

    def load_county_zips(input)
      puts ':: Loading County Zip records ::'
      files = Dir.glob(File.join(Rails.root, "db/seedfiles/plan_xmls/#{input[:state]}/xls_templates/counties", '**', '*.xlsx'))
      parsed_files = parse_files(files)
      parsed_files.each do |file|
        ::Operations::LoadCountyZip.new.call(file)
      end
      puts ':: Finished Loading County Zip records ::'
      Success(input)
    end

    def load_rating_areas(input)
      puts ':: Loading Rating Area records ::'
      files = Dir.glob(File.join(Rails.root, "db/seedfiles/plan_xmls/#{input[:state]}/xls_templates/rating_areas", '**', '*.xlsx'))
      parsed_files = parse_files(files)
      parsed_files.each do |file|
        ::Operations::LoadRatingAreas.new.call(file)
      end
      puts ':: Finished Loading Rating Area records ::'
      Success(input)
    end

    def load_rating_factors(input)
      puts ':: Loading County Rating Factor ::'
      files = Dir.glob(File.join(Rails.root, "db/seedfiles/plan_xmls/#{input[:state]}/xls_templates/rating_factors", '**', '*.xlsx'))
      parsed_files = parse_files(files)
      parsed_files.each do |file|
        ::Operations::LoadFactors.new.call(file)
      end
      puts ':: Finished Loading Rating Factor records ::'
      Success(input)
    end

    def load_service_areas(input)
      puts ':: Loading Service Areas ::'
      files = Dir.glob(File.join(Rails.root, "db/seedfiles/plan_xmls/#{input[:state]}/xls_templates/service_areas", '**', '*.xls'))
      parsed_files = parse_files(files)
      parsed_files.each do |file|
        ::Operations::LoadServiceAreas.new.call(file)
      end
      puts ':: Finished Loading Service Areas ::'
      Success(input)
    end

    def load_plans(input)
      puts ':: Loading Plans ::'
      files = Dir.glob(File.join(Rails.root, 'db/seedfiles/plan_xmls', input[:state], 'plans', '**', '*.xml'))
      parse_files(files)
      additional_files = Dir.glob(File.join(Rails.root, "db/seedfiles/plan_xmls/#{input[:state]}/master_xml", '**', '*.xlsx'))

      parsed_files = { package_xml_files: parse_files(files) }
      parsed_additional_files = { plan_xlsx_files: parse_files(additional_files) }

      transaction = Operations::LoadPlans.new
      transaction.call(parsed_files)
      transaction.call(parsed_additional_files)
      puts ':: Finished Loading Plans ::'
      Success(input)
    end

    def load_rates(input)
      puts ':: Loading Rates ::'
      files = Dir.glob(File.join(Rails.root, 'db/seedfiles/plan_xmls', input[:state], 'rates', '**', '*.xml'))
      parsed_files = parse_files(files)
      ::Operations::LoadRates.new.call(parsed_files)
      puts ':: Finished Loading Rates ::'
      Success(input)
    end

    def parse_files(files)
      files.map { |f| f.gsub!('~$', '') || f }.uniq
    end
  end
end
