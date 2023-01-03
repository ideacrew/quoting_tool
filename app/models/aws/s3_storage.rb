# frozen_string_literal: true

module Aws
  # Storing sbc files into s3
  class S3Storage
    ENV_LIST = %w[local prod preprod test uat qa].freeze

    def initialize
      setup
    end

    # If success, return URI which has the s3 bucket key
    # else return nil
    def save(file_path, key = SecureRandom.uuid)
      bucket_name = ENV['AEQT_SBC_BUCKET']
      uri = "urn:openhbx:terms:v1:file_storage:s3:bucket:#{bucket_name}##{key}"

      begin
        object = get_object(bucket_name, key)
        uri if object.upload_file(file_path, server_side_encryption: 'AES256')
      rescue StandardError => e
        log("ERROR: Unable to upload Notice to S3 bucket due to #{e.backtrace}", severity: 'critical')
        nil
      end
    end

    # If success, return URI which has the s3 bucket key
    # else return nil
    def self.save(file_path, key = SecureRandom.uuid)
      Aws::S3Storage.new.save(file_path, key)
    end

    private

    def get_object(bucket_name, key)
      @resource.bucket(bucket_name).object(key)
    end

    def setup
      client = Aws::S3::Client.new(stub_responses: (Rails.env.development? || Rails.env.test?))
      @resource = Aws::S3::Resource.new(client: client)
    end
  end
end
