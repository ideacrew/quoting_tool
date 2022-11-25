# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Operations::ProductBuilder, type: :operation do
  let(:subject) { described_class.new.call(attrs) }
  let(:qhp) { build(:qhp, qhp_cost_share_variances: [variance]) }
  let(:variance) { build(:qhp_cost_share_variance, qhp_service_visits: visits, qhp_deductable: deductable, qhp_maximum_out_of_pockets: [qhp_maximum_out_of_pocket]) }
  let(:visits) do
    [
      build(:qhp_service_visit, copay_in_network_tier_1: '$25 In Network', visit_type: 'Primary Care Visit to Treat an Injury or Illness'),
      build(:qhp_service_visit, copay_in_network_tier_1: '$25 In Network', visit_type: 'Emergency Room Services'),
      build(:qhp_service_visit, copay_in_network_tier_1: '$25 In Network', visit_type: 'Inpatient Hospital Services (e.g., Hospital Stay)'),
      build(:qhp_service_visit, copay_in_network_tier_1: '$25 In Network', visit_type: 'Generic Drugs')
    ]
  end

  let(:deductable) { build(:qhp_deductable) }
  let(:qhp_maximum_out_of_pocket) { build(:qhp_maximum_out_of_pocket) }
  let(:service_area) { create(:service_area, issuer_provided_code: '11111') }

  let(:health_data_map) do
    { ['123', Date.today.year] => {
      hios_id: '123',
      provider_directory_url: '',
      year: Date.today.year,
      rx_formulary_url: '',
      is_standard_plan: true,
      network_information: 'Tufts Health Direct is a focused-network plan.',
      title: 'Standard Platinum Plan',
      product_package_kinds: %i[single_product single_issuer]
    } }
  end

  let(:dental_data_map) do
    { ['112', Date.today.year] => {
      hios_id: '112',
      provider_directory_url: '',
      year: Date.today.year,
      is_standard_plan: true,
      network_information: nil,
      title: 'Standard Family High'
    } }
  end

  context 'succesful' do
    let(:service_area_map) do
      { [service_area.issuer_provided_code, 'MAS001', Date.today.year] => service_area.id }
    end

    let(:attrs) do
      {
        qhp: qhp,
        health_data_map: health_data_map,
        dental_data_map: dental_data_map,
        service_area_map: service_area_map
      }
    end

    it 'is success' do
      expect(subject.success?).to be true
    end

    it 'creates new product' do
      subject
      expect(Products::Product.all.size).not_to eq 0
    end

    it 'has a new product with pcp_in_network_copay as 25$' do
      subject
      expect(Products::Product.where(kind: :health).first.pcp_in_network_copay).to eq '25'
    end

    it 'returns success message' do
      expect(subject.success[:message]).to eq 'Successfully created/updated Plan records'
    end
  end

  context 'failure' do
    let(:attrs) do
      {
        qhp: qhp,
        health_data_map: health_data_map,
        dental_data_map: dental_data_map,
        service_area_map: {}
      }
    end

    context 'without service area' do
      it 'raises an error' do
        expect { subject }.to raise_error(Mongoid::Errors::Validations)
      end
    end
  end
end
