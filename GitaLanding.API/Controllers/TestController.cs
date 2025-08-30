using Microsoft.AspNetCore.Mvc;

namespace GitaLanding.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TestController : ControllerBase
    {
        [HttpGet]
        public IActionResult Get()
        {
            return Ok(new { 
                message = "GitaLanding API работает!", 
                timestamp = DateTime.UtcNow,
                version = "1.0.0"
            });
        }

        [HttpGet("health")]
        public IActionResult Health()
        {
            return Ok(new { 
                status = "Healthy", 
                timestamp = DateTime.UtcNow,
                uptime = Environment.TickCount / 1000
            });
        }
    }
}