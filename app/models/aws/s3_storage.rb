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
    def save(file_path, bucket_name, key = SecureRandom.uuid)
      bucket_name = env_bucket_name(bucket_name)
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
    def self.save(file_path, bucket_name, key = SecureRandom.uuid)
      Aws::S3Storage.new.save(file_path, bucket_name, key)
    end

    # The uri has information about the bucket name and key
    # e.g. "urn:openhbx:terms:v1:file_storage:s3:bucket:#{bucket_name}##{key}"
    # The returned object can be streamed by controller
    def find(uri)
      bucket_and_key = uri.split(':').last
      bucket_name, key = bucket_and_key.split('#')
      env_bucket_name = correct_env_bucket_name(bucket_name)
      object = get_object(env_bucket_name, key)
      read_object(object)
    rescue StandardError
      puts format('Error caused due to %<error_info_class>s', error_info_class: $ERROR_INFO.class) unless Rails.env.test?
      raise
    end

    # The param uri is present in Document model. Document.identifier
    # The uri has information about the bucket name and key
    # e.g. "urn:openhbx:terms:v1:file_storage:s3:bucket:#{bucket_name}##{key}"
    # The returned object can be streamed by controller
    def self.find(uri)
      Aws::S3Storage.new.find(uri)
    end

    private

    def read_object(object)
      object.get.body.read
    end

    def get_object(bucket_name, key)
      @resource.bucket(bucket_name).object(key)
    end

    def correct_env_bucket_name(bucket_name)
      bucket_name_segment = bucket_name.split('-')

      return bucket_name if ENV_LIST.include?(bucket_name_segment.last) && bucket_name_segment.last == aws_env

      bucket_name_segment[bucket_name_segment.length - 1] = aws_env
      bucket_name_segment.join('-')
    end

    def aws_env
      ENV['AWS_ENV'] || 'qa'
    end

    def env_bucket_name(bucket_name)
      "#{QuotingToolRegistry[:quoting_tool_app].setting(:s3_prefix).item}-aeqt-#{bucket_name}-#{aws_env}"
    end

    def setup
      client = Aws::S3::Client.new(stub_responses: (Rails.env.development? || Rails.env.test?))
      @resource = Aws::S3::Resource.new(client: client)
    end
  end
end
