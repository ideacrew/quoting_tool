# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Operations::SbcDocument, type: :transaction do
  let!(:health_product) { create(:health_product, title: 'test') }

  context 'succesful' do
    input = { key: 'some key', identifier: '' }
    let!(:subject) { described_class.new.call(input) }

    it 'creates new products area' do
      expect(Products::Product.all.size).not_to eq 0
    end

    it 'founds product' do
      expect(Products::Product.where(hios_id: ['11111']).size).to eq 0
    end
  end

  context 'blank_identifier failure' do
    blank_identifier_input = { key: 'test', identifier: '' }
    let!(:subject) { described_class.new.call(blank_identifier_input) }

    it 'is failure' do
      expect(subject.failure?).to be true
    end

    it 'does not found product' do
      expect(Products::Product.where(id: 'test').size).to eq 0
    end

    it 'returns failure message' do
      expect(subject.failure[:message]).to match 'Product/Sbc Document not found'
    end
  end

  context 'blank input failure' do
    blank_input = { key: '', identifier: '' }
    let!(:subject) { described_class.new.call(blank_input) }

    it 'is failure' do
      expect(subject.failure?).to be true
    end

    it 'returns failure message' do
      expect(subject.failure[:message]).to match 'Key should not be blank'
    end
  end

  context 'retrieve documents' do
    it 'mock sbc_document' do
      filename = 'sbc_document.txt'
      content = 'this would be the content of the file'

      expect(File).to receive(:open).with(filename, 'r').and_yield(StringIO.new(content))

      expect(StringIO.new(content).read).to eq(content)

      result = ''
      File.open('sbc_document.txt', 'r') { |f| result = f.read }
      expect(result).to eq(content)
    end
  end
end
