# frozen_string_literal: true

require 'csv'
require Rails.root.join('lib', 'sbc', 'sbc_processor')

ENV_LIST = %w[qa prod preprod cte cpr uat].freeze

namespace :sbc do
  desc 'Uploading Sbc Document'
  task :upload, [:csv_path, :dir_path] do |_task, args|
    # task :upload, [:csv_path, :dir_path] => :environment do |task, args|
    sbc_processor = SbcProcessor.new(args.csv_path, args.dir_path)
    sbc_processor.run
  end
end
