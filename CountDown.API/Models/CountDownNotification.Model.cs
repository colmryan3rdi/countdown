using System;

namespace CountDown.Api.Models
{
    public class CountDownNotification
    {
        public string Notification { get; set; }
        public DateTime? TimeArrived { get; set; }
    }
}