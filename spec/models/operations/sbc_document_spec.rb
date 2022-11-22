require 'rails_helper'

RSpec.describe Operations::SbcDocument, type: :transaction do

  let!(:health_product) { FactoryBot.create(:health_product, title: "test")}
  
  context "succesful" do
    input = { :key => "some key", :identifier => "" }
    let!(:subject) {Operations::SbcDocument.new.call(input)}

    it "should create new products area" do
      expect(Products::Product.all.size).not_to eq 0
    end

    it "should found product" do
      expect(Products::Product.where(hios_id: ["11111"]).size).to eq 0
    end
  end

  context "blank_identifier failure" do
    blank_identifier_input = { :key => "test", :identifier => "" }
    let!(:subject) {Operations::SbcDocument.new.call(blank_identifier_input)}

    it "should be failure" do
      expect(subject.failure?).to eq true
    end

    it "should not found product" do
      expect(Products::Product.where(id: "test").size).to eq 0
    end

    it "should return failure message" do
      expect(subject.failure[:message]).to match "Product/Sbc Document not found"
    end
  end

  context "blank input failure" do
    blank_input = { :key => "", :identifier => "" }
    let!(:subject) {Operations::SbcDocument.new.call(blank_input)}

    it "should be failure" do
      expect(subject.failure?).to eq true
    end

    it "should return failure message" do
      expect(subject.failure[:message]).to match "Key should not be blank"
    end
  end

end
