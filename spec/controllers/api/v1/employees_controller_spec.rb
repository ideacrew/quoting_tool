# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Api::V1::EmployeesController do
  describe '#start_on_dates' do
    let(:current_date) { Date.today }
    let!(:health_product) { FactoryBot.create(:health_product, service_area_id: service_area.id) }
    let!(:dental_product) { FactoryBot.create(:dental_product, service_area_id: service_area.id) }
    let!(:rating_area) { FactoryBot.create(:rating_area, county_zip_ids: [county_zip.id]) }
    let(:service_area) { FactoryBot.create(:service_area, county_zip_ids: [county_zip.id]) }
    let(:county_zip) { FactoryBot.create(:county_zip) }

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
      before :each do
        get :start_on_dates
      end

      it 'should return success' do
        expect(response).to have_http_status(:success)
      end

      it 'should return empty set for dates' do
        parsed_response = JSON.parse(response.body)
        expect(parsed_response['dates']).to eq []
        expect(parsed_response['is_late_rate']).to eq true
      end
    end

    context 'when rates are available for projected month' do
      let(:next_year) { Date.today.next_year }
      let!(:next_health_product) { FactoryBot.create(:health_product, application_period: (next_year.beginning_of_year..next_year.end_of_year)) }
      let!(:next_dental_product) { FactoryBot.create(:dental_product, application_period: (next_year.beginning_of_year..next_year.end_of_year)) }
      before :each do
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

      it 'should return success' do
        expect(response).to have_http_status(:success)
      end

      it 'should return set for dates' do
        parsed_response = JSON.parse(response.body)
        expect(parsed_response['dates'].empty?).to eq false
        expect(parsed_response['is_late_rate']).to eq false
        expect(parsed_response['is_sic_codes_enabled']).to_not eq nil
      end
    end

    describe '#fetch_feature_flags' do
      it 'gets feature flags and response should present' do
        get :fetch_feature_flags

        expect(response.code.to_i).to eq(200)
        expect(JSON.parse(response.body).keys).to include('display_footer_email')
      end
    end
  end
end
