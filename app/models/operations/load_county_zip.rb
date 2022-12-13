# frozen_string_literal: true

require 'dry/monads'
require 'dry/monads/do'

module Operations
  # This class is to load county zips
  class LoadCountyZip
    include Dry::Monads[:result, :do]

    def call(input_file)
      sheet = yield validate_and_load_sheet(input_file)
      loaded_sheet_data = yield load_sheet_data(sheet)
      created_records = yield create_records(loaded_sheet_data)
      Success(created_records)
    end

    private

    def validate_and_load_sheet(input_file)
      roo_file = Roo::Spreadsheet.open(input_file)
      required_sheet_name = 'Master Zip Code List'
      return Failure(message: "Sheet - #{required_sheet_name} not found when loading County Zip records") unless roo_file.sheets.include?(required_sheet_name)

      sheet = roo_file.sheet(required_sheet_name)
      return Failure(message: 'Zip/County headers not found when loading County Zip') if (sheet.row(1) & %w[zip County]).size != 2

      Success(sheet: sheet)
    end

    def load_sheet_data(sheet_data)
      sheet = sheet_data[:sheet]
      columns = sheet.row(1).map(&:parameterize).map(&:underscore)
      output = (2..sheet.last_row).each_with_object([]) do |id, result|
        row = Hash[[columns, sheet.row(id)].transpose]

        result << {
          county_name: parse_text(row['county']),
          zip: parse_text(row['zip']),
          state: 'ME' # update later
        }
      end
      Success(result: output)
    end

    def create_records(file_data)
      file_data[:result].each_with_index do |json, i|
        return Failure(message: "Failed to create County Zip record for index #{i}") unless Locations::CountyZip.find_or_create_by(json)
      end
      Success(message: "Successfully created #{file_data[:result].size} County Zip records")
    end

    def parse_text(row_field)
      return nil if row_field.nil?

      row_field.to_s.squish!
    end
  end
end
