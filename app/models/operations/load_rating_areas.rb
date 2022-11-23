# frozen_string_literal: true

require 'dry/monads'
require 'dry/monads/do'

module Operations
  class LoadRatingAreas
    include Dry::Monads[:result, :do]

    def call(input)
      file          =  yield load_file_info(input)
      file_info     =  yield validate_file_info(file)
      file_data     =  yield load_file_data(file_info)
      file_records  =  yield validate_records(file_data)
      records       =  yield create_records(file_records)
      Success(records)
    end

    private

    def load_file_info(input)
      year = input.split('/')[-2].to_i
      file = Roo::Spreadsheet.open(input)
      sheet = file.sheet(0)
      Success(sheet: sheet, year: year)
    end

    def validate_file_info(input)
      # validate here by adding new Validator
      Success(input)
    end

    def load_file_data(input)
      sheet = input[:sheet]
      year = input[:year]
      columns = input[:sheet].row(1).map(&:parameterize).map(&:underscore)
      output = Hash.new { |results, k| results[k] = [] }

      (2..sheet.last_row).each do |i|
        output[sheet.cell(i, 4)] << {
          'county_name' => sheet.cell(i, 2),
          'zip' => sheet.cell(i, 1)
        }
      end
      Success(result: output, year: year)
    end

    def validate_records(input)
      # validate records here by adding new Validator
      Success(input)
    end

    def create_records(input)
      year = input[:year]
      input[:result].each do |rating_area_id, locations|
        location_ids = locations.map do |loc_record|
          county_zip = Locations::CountyZip.where(
            zip: loc_record['zip'],
            county_name: loc_record['county_name']
          ).first
          county_zip._id
        end

        rating_area = Locations::RatingArea.where(
          active_year: year,
          exchange_provided_code: rating_area_id
        ).first

        if rating_area.present?
          rating_area.county_zip_ids = location_ids
          Failure(message: "Failed to Save Rating Area record for #{rating_area.id}") unless rating_area.save
        else
          rating_area = Locations::RatingArea.new(
            active_year: year,
            exchange_provided_code: rating_area_id,
            county_zip_ids: location_ids
          )

          return Failure(message: "Failed to Create Rating Area record for #{rating_area_id}") unless rating_area.save
        end
      end
      Success(message: "Successfully created/updated #{input[:result].keys.size} Rating Area records")
    end

    def parse_text(input)
      return nil if input.nil?

      input.squish!
    end
  end
end
