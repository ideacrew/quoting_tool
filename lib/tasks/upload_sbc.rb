year = ENV['sbc_year']
csv_path = "db/seedfiles/plan_xmls/me/sbcs/#{year}/#{year}_sbcs.csv"
dir_path = "db/seedfiles/plan_xmls/me/sbcs/#{year}/"

sbc_processor = ::Services::SbcProcessor.new(csv_path, dir_path)
sbc_processor.run
