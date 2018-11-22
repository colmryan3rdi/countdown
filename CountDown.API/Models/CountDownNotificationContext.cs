using Microsoft.EntityFrameworkCore;

namespace CountDown.Api.Models
{
    public class CountDownNotificationContext : DbContext
    {
        public CountDownNotificationContext(DbContextOptions<CountDownNotificationContext> options)
            : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<CountDownNotification>()
                .HasKey(c => c.TimeArrived);
        }
        public DbSet<CountDownNotification> CountDownNotifications { get; set; }
    }
}