# frozen_string_literal: true

require 'rails_helper'

describe Aws::S3Storage do
  let(:subject) { Aws::S3Storage.new }
  let(:aws_env) { ENV['AWS_ENV'] || 'qa' }
  let(:object) { double }
  let(:bucket_name) { 'bucket1' }
  let(:file_path) { File.dirname(__FILE__) }
  let(:key) { SecureRandom.uuid }
  let(:uri) { "urn:openhbx:terms:v1:file_storage:s3:bucket:#{QuotingToolRegistry[:quoting_tool_app].setting(:s3_prefix).item}-aeqt-#{bucket_name}-#{aws_env}##{key}" }
  let(:invalid_url) { 'urn:openhbx:terms:v1:file_storage:s3:bucket:' }
  let(:file_content) { 'test content' }

  before :each do
    stub_const('ENV', ENV.to_hash.merge('AEQT_SBC_BUCKET' => 'cme-aeqt-bucket1-qa'))
  end

  describe 'save()' do
    context 'successful upload with explicit key' do
      it 'return the URI of saved file' do
        allow(object).to receive(:upload_file).with(file_path, server_side_encryption: 'AES256').and_return(true)
        allow_any_instance_of(Aws::S3Storage).to receive(:get_object).and_return(object)
        expect(subject.save(file_path, key)).to eq(uri)
      end
    end

    context 'successful upload without explicit key' do
      it 'return the URI of saved file' do
        allow(object).to receive(:upload_file).with(file_path, server_side_encryption: 'AES256').and_return(true)
        allow_any_instance_of(Aws::S3Storage).to receive(:get_object).and_return(object)
        expect(subject.save(file_path)).to include('urn:openhbx:terms:v1:file_storage:s3:bucket:')
      end
    end

    context 'failed upload' do
      it 'returns nil' do
        allow(object).to receive(:upload_file).with(file_path, server_side_encryption: 'AES256').and_return(nil)
        allow_any_instance_of(Aws::S3Storage).to receive(:get_object).and_return(object)
        expect(subject.save(file_path)).to be_nil
      end
    end
  end
end
