using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;
using System;
using CountDown.Api.Models;

namespace CountDown.Api.Controllers
{

    [Route("[controller]")]
    [ApiController]
    public class CountDownNotificationController : ControllerBase
    {

        private readonly CountDownNotificationContext _context;

        public CountDownNotificationController(CountDownNotificationContext context)
        {
            _context = context;
        }
        
        [HttpGet]
        public ActionResult<List<CountDownNotification>> GetAll()
        {
            return _context.CountDownNotifications.ToList();
        }

        // POST api/values
        [HttpPost]
        public IActionResult Post([FromBody] CountDownNotification notification)
        {
            var newNotification = new CountDownNotification { TimeArrived = DateTime.Now, Notification = notification.Notification};
            _context.CountDownNotifications.Add(newNotification);
            _context.SaveChanges();
    

            return Ok(newNotification);
        }

        [HttpDelete]
        public IActionResult Delete()
        {
            _context.CountDownNotifications.RemoveRange(_context.CountDownNotifications);
            _context.SaveChanges();
            return Ok();
        }
     }
}
