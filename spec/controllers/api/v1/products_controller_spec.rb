# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Api::V1::ProductsController do
  describe '#plans' do
    let(:attrs) do
      { sic_code: '0112', start_date: Date.today.beginning_of_month, county_name: county_zip.county_name, zip_code: county_zip.zip, state: county_zip.state }
    end

    let!(:health_product) { create(:health_product, service_area_id: service_area.id) }
    let!(:dental_product) { create(:dental_product, service_area_id: service_area.id) }
    let!(:rating_area) { create(:rating_area, county_zip_ids: [county_zip.id]) }
    let(:service_area) { create(:service_area, county_zip_ids: [county_zip.id]) }
    let(:county_zip) { create(:county_zip) }

    context 'loading health plans' do
      let(:health_attrs) { attrs.merge!(kind: 'health') }

      before do
        get :plans, params: health_attrs
      end

      it 'returns success' do
        expect(response).to have_http_status(:success)
      end

      it 'returns json response status as success' do
        parsed_response = JSON.parse(response.body)
        expect(parsed_response['status']).to eq 'success'
      end

      it 'returns health plans json' do
        parsed_response = JSON.parse(response.body)
        expect(parsed_response['plans'][0]['metal_level']).to eq health_product.metal_level # update this after dbcleaner
      end
    end

    context 'loading dental plans' do
      let(:dental_attrs) { attrs.merge!(kind: 'dental') }

      before do
        get :plans, params: dental_attrs
      end

      it 'returns success' do
        expect(response).to have_http_status(:success)
      end

      it 'returns json response status as success' do
        parsed_response = JSON.parse(response.body)
        expect(parsed_response['status']).to eq 'success'
      end

      it 'returns dental plans json' do
        parsed_response = JSON.parse(response.body)
        expect(parsed_response['plans'][0]['metal_level']).to eq dental_product.metal_level_kind.to_s # update this after dbcleaner
      end
    end
  end
end
