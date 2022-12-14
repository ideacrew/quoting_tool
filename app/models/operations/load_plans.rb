# frozen_string_literal: true

module Operations
  # This is to load plans for state
  class LoadPlans
    include Dry::Monads[:result, :do]

    def call(input_files)
      validated_input_files = yield validate_files(input_files)
      files_data = yield load_file_data(validated_input_files)
      created_records = yield create_records(files_data)
      Success(created_records)
    end

    private

    def validate_files(input_files)
      validate_package_xml_files(input_files[:package_xml_files]) if input_files[:package_xml_files].present?
      validate_plan_xlsx_files(input_files[:plan_xlsx_files]) if input_files[:plan_xlsx_files].present?
      Success(files: input_files[:package_xml_files],
              additional_files: input_files[:plan_xlsx_files])
    end

    def validate_package_xml_files(package_xml_files)
      package_xml_files.each do |file|
        doc = Nokogiri::XML(File.open(file))
        return Failure(message: "Invalid XML file upon loading plans - #{file}") if doc.errors.present?
      end
    end

    def validate_plan_xlsx_files(plan_xlsx_files)
      plan_xlsx_files.each do |file|
        year = file.split('/')[-2].to_i
        xlsx = Roo::Spreadsheet.open(file)
        unless xlsx.sheets.include?("#{year}_QHP") &&
               xlsx.sheets.include?("#{year}_QDP")
          return Failure(message: "Invalid XLSX file upon loading plans - #{file}")
        end
      end
    end

    def load_file_data(input)
      output = []
      data = []
      output = load_packages_list(input) if input[:files].present?

      if input[:additional_files].present?
        data = input[:additional_files].inject([]) do |result, file|
          year = file.split('/')[-2].to_i
          xlsx_file = Roo::Spreadsheet.open(file)
          health_data = load_health_sheet_data(xlsx_file, year)
          dental_data = load_dental_sheet_data(xlsx_file, year)
          result += [health_data, dental_data]
          result
        end
      end

      Success(result: output, data: data)
    end

    def load_health_sheet_data(xlsx_file, year)
      health_sheet = xlsx_file.sheet("#{year}_QHP")
      health_columns = health_sheet.row(1).map(&:parameterize).map(&:underscore)
      (2..health_sheet.last_row).each_with_object([]) do |id, res|
        row = Hash[[health_columns, health_sheet.row(id)].transpose]

        product_package_kinds = []
        product_package_kinds << :single_product if parse_boolean(row['sole_source_offering'])
        product_package_kinds << :metal_level if parse_boolean(row['horizontal_offering'])
        product_package_kinds << :single_issuer if parse_boolean(row['vertical_offerring'])

        res << {
          hios_id: parse_text(row['hios_standard_component_id']),
          provider_directory_url: parse_text(row['provider_directory_url']),
          year: year,
          rx_formulary_url: parse_url(parse_text(row['rx_formulary_url'])),
          is_standard_plan: parse_boolean(row['standard_plan']),
          network_information: parse_text(row['network_notes']),
          title: parse_text(row['plan_name']),
          product_package_kinds: product_package_kinds
        }
      end
    end

    def load_dental_sheet_data(xlsx_file, year)
      dental_sheet = xlsx_file.sheet("#{year}_QDP")
      dental_columns = dental_sheet.row(1).map(&:parameterize).map(&:underscore)

      (2..dental_sheet.last_row).each_with_object([]) do |id, res|
        row = Hash[[dental_columns, dental_sheet.row(id)].transpose]

        res << {
          hios_id: parse_text(row['hios_standard_component_id']),
          provider_directory_url: parse_text(row['provider_directory_url']),
          year: year,
          is_standard_plan: parse_boolean(row['standard_plan']),
          network_information: parse_text(row['network_notes']),
          title: parse_text(row['plan_name'])
        }
      end
    end

    def load_packages_list(input)
      input[:files].inject([]) do |result, file|
        puts "processing file: #{file}"
        xml = Nokogiri::XML(File.open(file))
        product_hash = Parsers::Products::PlanBenefitTemplateParser.parse(xml.root.canonicalize, single: true).to_hash
        result += product_hash[:packages_list][:packages]
        result
      end
    end

    def create_records(input)
      health_data_map = {}
      dental_data_map = {}

      if input[:data].present?

        input[:data][0].map do |data|
          health_data_map[[data[:hios_id], data[:year]]] = data
        end

        input[:data][1].map do |data|
          dental_data_map[[data[:hios_id], data[:year]]] = data
        end
      end

      Operations::QhpBuilder.new.call(packages: input[:result], health_data_map: health_data_map, dental_data_map: dental_data_map, service_area_map: service_area_map)
      Success(message: 'Plans Succesfully Created')
    end

    def service_area_map
      @service_area_map = {}
      ::Locations::ServiceArea.all.map do |sa|
        @service_area_map[[sa.issuer_hios_id, sa.issuer_provided_code, sa.active_year]] = sa.id
      end
      @service_area_map
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
