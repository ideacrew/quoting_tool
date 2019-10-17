class Api::V1::ProductsController < ApplicationController
  respond_to :json

  def plans
    # effective_date = params[:start_date].to_date
    effective_date = DateTime.new(2020, 1, 1)
    year = 2020 || effective_date.year # toDO
    month = 1 || effective_date.month

    county = params[:county_name].squish!
    zip = params[:zip_code].squish!

    county_zips = Rails.cache.fetch("county_zips_#{county}_#{zip}", expires_in: 45.minutes) do
      ::Locations::CountyZip.all.where(county_name: params[:county_name], zip: params[:zip_code]).map(&:id).uniq
    end

    service_area_ids = Rails.cache.fetch("service_area_ids_#{county}_#{zip}_#{year}", expires_in: 45.minutes) do
      ::Locations::ServiceArea.where(
        "active_year" => year,
        "$or" => [
          {"county_zip_ids" => { "$in" => county_zips }},
          {"covered_states" =>  "MA"} # get this from settings
        ]
      ).map(&:id)
    end

    rating_area_id = Rails.cache.fetch("rating_area_id_#{county}_#{zip}_#{year}", expires_in: 45.minutes) do
      ::Locations::RatingArea.where(
        "active_year" => year,
        "county_zip_ids" => { "$in" => county_zips }
      ).first.id
    end

    data = Rails.cache.fetch("data_#{county}_#{zip}_#{year}_#{month}", expires_in: 45.minutes) do
      products = Products::Product.where(:"service_area_id".in => service_area_ids, :"application_period.min".gte => effective_date, :"application_period.max".lte => Date.new(year, 1, 1).end_of_year)
      products.inject([]) do |result, product|
        result << ::ProductSerializer.new(product, params: {key: params[:sic_code], rating_area_id: rating_area_id}).serializable_hash[:data][:attributes]
        result
      end
    end
    render :json => {status: "success", plans: data}
  end
end
