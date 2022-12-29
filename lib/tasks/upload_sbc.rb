csv_path = 'db/seedfiles/plan_xmls/me/sbcs/2023/2023_sbcs.csv'
dir_path = 'db/seedfiles/plan_xmls/me/sbcs/2023/'
sbc_processor = ::Services::SbcProcessor.new(csv_path, dir_path)
sbc_processor.run