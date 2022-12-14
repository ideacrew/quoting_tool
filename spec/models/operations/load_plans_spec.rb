# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Operations::LoadPlans do
  let(:county_zip) { FactoryBot.create(:county_zip, zip: '12345', county_name: 'County 1') }

  let(:files) { Dir.glob(File.join(Rails.root, 'spec/test_data/plans', '*.xml')) }
  let(:additional_files) do
    Dir.glob(File.join(Rails.root, 'spec/test_data/plans/2020/master_xml.xlsx'))
  end

  context 'succesful' do
    let!(:service_area) do
      FactoryBot.create(:service_area, county_zip_ids: [county_zip.id],
                                       active_year: 2020)
    end
    let!(:subject) do
      input_files = { package_xml_files: files,
                      plan_xlsx_files: additional_files }
      Operations::LoadPlans.new.call(input_files)
    end

    it 'should be success' do
      expect(subject.success?).to eq true
    end

    it 'should create new health plans' do
      expect(Products::HealthProduct.all.size).not_to eq 0
    end

    it 'should create new dental plans' do
      expect(Products::DentalProduct.all.size).not_to eq 0
    end

    it 'should return success message' do
      expect(subject.success[:message]).to eq 'Plans Succesfully Created'
    end
  end

  context 'failure' do
    let(:subject) do
      input_files = { package_xml_files: files,
                      plan_xlsx_files: additional_files }
      Operations::LoadPlans.new.call(input_files)
    end

    it 'should not create product' do
      expect(Products::Product.all.size).to eq 0
    end

    it 'should raise an error' do
      expect { subject }.to raise_error(Mongoid::Errors::Validations)
    end
  end
end
