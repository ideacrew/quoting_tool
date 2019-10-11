module Transactions
  class LoadPlans
    include Dry::Transaction

    step :load_file_info
    step :validate_file_info
    step :load_file_data
    step :validate_records
    step :create_records

    private


    def load_file_info(input)
      Success({files: input})
    end

    def validate_file_info(input)
      # validate here by adding new Validator
      Success(input)
    end

    def load_file_data(input)
      output = input[:files].inject([]) do |result, file|
        xml = Nokogiri::XML(File.open(file))
        product_hash = Parsers::Products::PlanBenefitTemplateParser.parse(xml.root.canonicalize, :single => true).to_hash
        result += product_hash[:packages_list][:packages]
      end
      Success({result: output})
    end

    def validate_records(input)
      # validate records here by adding new Validator
      Success(input)
    end

    def create_records(input)
      builder = Operations::QhpBuilder.new.call({packages: input[:result], service_area_map: service_area_map})
    end

    def service_area_map
      @service_area_map = {}
      ::Locations::ServiceArea.all.map do |sa|
        @service_area_map[[sa.issuer_hios_id, sa.issuer_provided_code, sa.active_year]] = sa.id
      end
      @service_area_map
    end
  end
end
