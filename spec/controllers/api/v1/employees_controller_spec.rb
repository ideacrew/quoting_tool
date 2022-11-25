# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Api::V1::EmployeesController do
  describe '#start_on_dates' do
    let(:current_date) { Date.today }
    let!(:health_product) { create(:health_product, service_area_id: service_area.id) }
    let!(:dental_product) { create(:dental_product, service_area_id: service_area.id) }
    let!(:rating_area) { create(:rating_area, county_zip_ids: [county_zip.id]) }
    let(:service_area) { create(:service_area, county_zip_ids: [county_zip.id]) }
    let(:county_zip) { create(:county_zip) }

    let!(:premium_tuples) do
      tuples = []
      (1..65).each do |age|
        tuples << ::Products::PremiumTuple.new(
          age: age,
          cost: age
        )
      end
      tuples
    end

    let!(:premium_tables) do
      ::Products::Product.all.health_products.each do |product|
        product.premium_ages = premium_tuples.map(&:age).minmax
        product.save!
      end
    end

    context 'when rates are not available for projected month' do
      before do
        get :start_on_dates
      end

      it 'returns success' do
        expect(response).to have_http_status(:success)
      end

      it 'returns empty set for dates' do
        parsed_response = JSON.parse(response.body)
        expect(parsed_response['dates']).to eq []
        expect(parsed_response['is_late_rate']).to be true
      end
    end

    context 'when rates are available for projected month' do
      let(:next_year) { Date.today.next_year }
      let!(:next_health_product) { create(:health_product, application_period: (next_year.beginning_of_year..next_year.end_of_year)) }
      let!(:next_dental_product) { create(:dental_product, application_period: (next_year.beginning_of_year..next_year.end_of_year)) }

      before do
        ::Products::Product.all.health_products.each do |product|
          year = product.active_year == current_date.year ? current_date.year : next_year.year
          product.premium_tables << ::Products::PremiumTable.new(
            effective_period: Date.new(year, 1, 1)..Date.new(year, 12, 31),
            rating_area_id: rating_area.id,
            premium_tuples: premium_tuples
          )
          product.premium_ages = premium_tuples.map(&:age).minmax
          product.save!
        end
        get :start_on_dates
      end

      it 'returns success' do
        expect(response).to have_http_status(:success)
      end

      it 'returns set for dates' do
        parsed_response = JSON.parse(response.body)
        expect(parsed_response['dates'].empty?).to be false
        expect(parsed_response['is_late_rate']).to be false
      end
    end
  end
end
