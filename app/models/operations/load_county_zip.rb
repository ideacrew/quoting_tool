require 'dry/monads'
require 'dry/monads/do'
module Operations
  class LoadCountyZip
    include Dry::Monads[:result, :do]

    def call(input)
      file_info = yield load_file_info(input)
      validated_file_info = yield validate_file_info(file_info)
      file_data = yield load_file_data(validated_file_info)
      validated_records = yield validate_records(file_data)
      created_records = yield create_records(validated_records)
      Success(created_records)
    end

    private


    def load_file_info(input)
      file = Roo::Spreadsheet.open(input)
      sheet = file.sheet("Master Zip Code List")
      Success({sheet: sheet})
    end

    def validate_file_info(input)
      # validate here by adding new Validator
      Success(input)
    end

    def load_file_data(input)
      sheet = input[:sheet]
      columns = sheet.row(1).map(&:parameterize).map(&:underscore)
      output = (2..sheet.last_row).inject([]) do |result, id|
        row = Hash[[columns, sheet.row(id)].transpose]

        result << {
          county_name: parse_text(row["county"]),
          zip: parse_text(row["zip"]),
          state: "MA" # get this from settings
        }

        result
      end
      Success({result: output})
    end

    def validate_records(input)
      # validate records here by adding new Validator
      Success(input)
    end

    def create_records(input)
      input[:result].each_with_index do |json, i|
        unless Locations::CountyZip.find_or_create_by(json)
          return Failure({message: "Failed to create County Zip record for index #{i}"})
        end
      end
      Success({message: "Successfully created #{input[:result].size} County Zip records"})
    end

    def parse_text(input)
      return nil if input.nil?
      input.to_s.squish!
    end
  end
end
