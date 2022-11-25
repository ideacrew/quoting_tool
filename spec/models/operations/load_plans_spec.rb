# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Operations::LoadPlans do
  let(:county_zip) { create(:county_zip, zip: '12345', county_name: 'County 1') }

  let(:files) { Dir.glob(File.join(Rails.root, 'spec/test_data/plans', '*.xml')) }
  let(:additional_files) do
    Dir.glob(File.join(Rails.root, 'spec/test_data/plans/2020/master_xml.xlsx'))
  end

  context 'succesful' do
    let!(:service_area) do
      create(:service_area, county_zip_ids: [county_zip.id],
                            active_year: 2020)
    end
    let!(:subject) do
      input_files = { package_xml_files: files,
                      plan_xlsx_files: additional_files }
      described_class.new.call(input_files)
    end

    it 'is success' do
      expect(subject.success?).to be true
    end

    it 'creates new health plans' do
      expect(Products::HealthProduct.all.size).not_to eq 0
    end

    it 'creates new dental plans' do
      expect(Products::DentalProduct.all.size).not_to eq 0
    end

    it 'returns success message' do
      expect(subject.success[:message]).to eq 'Plans Succesfully Created'
    end
  end

  context 'failure' do
    let(:subject) do
      input_files = { package_xml_files: files,
                      plan_xlsx_files: additional_files }
      described_class.new.call(input_files)
    end

    it 'does not create product' do
      expect(Products::Product.all.size).to eq 0
    end

    it 'raises an error' do
      expect { subject }.to raise_error(Mongoid::Errors::Validations)
    end
  end
end
