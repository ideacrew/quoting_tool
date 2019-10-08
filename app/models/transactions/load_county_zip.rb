module Transactions
  class LoadCountyZip
    include Dry::Transaction

    step :load_file_info
    step :validate_file_info
    step :load_file_data
    step :validate_records
    step :create_records

    private


    def load_file_info(input)
      file = Roo::Spreadsheet.open(input)
      sheet = file.sheet("Master Zip Code List")
      Success(sheet)
    end

    def validate_file_info(input)
      # validate here by adding new Validator
      Success(input)
    end

    def load_file_data(sheet)
      columns = sheet.row(1).map(&:underscore)
      output = (4..sheet.last_row).inject([]) do |result, id|
        row = Hash[[columns, sheet.row(id)].transpose]
        
        result << {
          county_name: parse_text(row["county"]),
          zip: parse_text(row["zip"]),
          state: "MA" # get this from settings
        }

        result
      end
      Success(output)
    end

    def validate_records(input)
      # validate records here by adding new Validator
      Success(input)
    end

    def create_records(input)
      input.each_with_index do |json, i|
        unless ::BenefitMarkets::Locations::CountyZip.find_or_create_by(json)
          return Failure({message: "Failed to create County Zip record for index #{i}"})
        end
      end
      Success({message: "Successfully created #{input.size} County Zip records"})
    end

    def parse_text(input)
      return nil if input.nil?
      input.squish!
    end
  end
end
