---
layout: post
title: Rails日志导出CSV分析
date: 2012-10-06 10:28:00
categories: [newest, ruby]
---

众所周知，Rails的日志文件是文本类型的，如果要对日志文件进行分析时，比如延迟分析，不能像看图表一样直观。

我们可以先将日志文件转换为excel格式的xls、csv文件，然后转换成图表格式。  
Ruby代码如下(Ruby-1.9.3, Rails-3.2.8)：

{% highlight ruby %}
require "csv.rb"  
log_file_path = "production.log"
csv_file_path = log_file_path.match('(\w+)\.log')[1] + ".csv"  
puts "limit response time(default 0ms):"
(limit_response_time = gets.to_i) >= 0 ? limit_response_time : 0  
def response_regex
  'Completed \d+ \w+ in (\d+)ms'
end  
def get_status(paragraph)
  request_regex = 'Started GET \"(\/.*)\" for ([\d]+\.[\d]+\.[\d]+\.[\d]+) at [\d]*-([\d]*-[\d]* [\d]*:[\d]*:[\d]*)'
  controller_regex = 'Processing by ([\w]+#[\w]+)'  
  if paragraph.match(request_regex) != nil
    request_url = paragraph.match(request_regex)[1]
    request_host = paragraph.match(request_regex)[2]
    request_at =  paragraph.match(request_regex)[3]
  end  
  if paragraph.match(controller_regex) != nil
    controller_name = paragraph.match(controller_regex)[1]
  end  
  if paragraph.match(response_regex) != nil
    total_time = paragraph.match(response_regex)[1]
  end  
  request_status = [request_url, request_host, request_at, 
    controller_name, total_time]
  # request_status.each do |each_status|
  #   puts each_status
  # end
  request_status
end  
CSV.open(csv_file_path, "wb:gbk") do |csv|
  csv << ["请求发送的地址", "请求发送的主机", "请求发送的时间", "请求回复的模块名称","响应时间(ms)"]
  File.open(log_file_path, "r:utf-8") do |file|
    paragraph = ""
    begin_flag = false
    # 对每一行进行判断
    file.each do |line|
      # 以"Started GET "开头为一个paragraph
      if line.start_with?("Started GET ")
        if !begin_flag
          begin_flag = true
          paragraph.concat(line)
        else
          # 另一个paragraph的开头
          # puts paragraph
          # gets  
          if (paragraph.match(response_regex) != nil)
            if paragraph.match(response_regex)[1].to_i >= limit_response_time
              csv << get_status(paragraph)
            end
          end
          begin_flag = true
          paragraph = line
        end
      else
        if begin_flag
          paragraph.concat(line)
        else
          # p "无效日志行"
        end
      end
    end 
  end
end  
{% endhighlight %}
