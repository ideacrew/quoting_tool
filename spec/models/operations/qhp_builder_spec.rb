# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Operations::QhpBuilder, type: :operation do
  let(:package) do
    {
      header: {
        issuer_id: '11111',
        state_postal_code: 'MA',
        market_coverage: 'SHOP (Small Group)',
        dental_plan_only_ind: 'No'
      },
      plans_list: { plans: [
        {
          plan_attributes: {
            plan_effective_date: '1/1/2020',
            standard_component_id: '11111MA0030009',
            plan_marketing_name: 'Standard Platinum',
            hios_product_id: '11111MA003',
            network_id: 'MAN001',
            service_area_id: 'MAS001',
            formulary_id: 'MAF001',
            is_new_plan: 'Existing',
            plan_type: 'HMO',
            metal_level: 'Platinum',
            qhp_or_non_qhp: 'Both',
            emp_contribution_amount_for_hsa_or_hra: '',
            child_only_offering: 'Allows Adult and Child-Only',
            out_of_country_coverage: 'Yes',
            out_of_service_area_coverage: 'Yes',
            national_network: 'No',
            ehb_percent_premium: '0.995'
          },
          cost_share_variance_list_attributes: []
        }
      ] },
      benefits_list: { benefits: [] }
    }
  end

  context 'succesful' do
    let!(:subject) { described_class.new.call(attrs) }

    let(:attrs) do
      {
        packages: [package]
      }
    end

    it 'is success' do
      expect(subject.success?).to be true
    end

    it 'creates new qhp' do
      expect(Products::Qhp.all.size).not_to eq 0
    end

    it 'returns success message' do
      expect(subject.success[:message]).to eq 'Successfully created/updated QHP records'
    end
  end

  context 'failure' do
    let(:invalid_package) do
      package[:plans_list][:plans][0][:plan_attributes][:service_area_id] = nil
      package
    end

    let(:attrs) do
      {
        packages: [invalid_package]
      }
    end

    let(:subject) { described_class.new.call(attrs) }

    it 'raises an error' do
      expect { subject }.to raise_error(Mongoid::Errors::Validations)
    end
  end
end
