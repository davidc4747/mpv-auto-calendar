# Description

[mpv](https://mpv.io) user script that tracks your time watching videos and logs it to Google calendar

# How to Install

Clone the repo to your mpv `scripts` directory. Then build the project

On Windows: `C:/Users/{Username}/AppData/Roaming/mpv/scripts/`

On Linux: `~/.config/mpv/scripts/`

```bash
git clone 'https://github.com/davidc4747/mpv-auto-calendar.git' ~/.config/mpv/scripts/auto-calendar
npm install
npm run build
```

Before the auto-calendar can run, you'll have to give it access to your google calendar. Running the `authrorize.js` script will take you through the steps to do that. if your browser doesn't open immediately, you can manually go to the url printed in the terminal

```bash
node authorize.js       # Gives auto-calendar access to use your Google Calendar
```

After that everything should be good to go 🙂

# Configuration

auto-calendar has a few configuration options. You can edit them by adding a `auto_calendar.conf` file to your `scripts-opts` directory:

On Windows: `C:/Users/{Username}/AppData/Roaming/mpv/scripts-opts/auto_calendar.conf`

On Linux: `~/.config/mpv/scripts-opts/auto_calendar.conf`

### Default Config:

```bash
calendar_name=auto-calendar         # Name of the calendar that events will be added to
event_name=mpv                      # Text used to describe the calendar event
event_color_id=11                   # Color of the calendar event

# After the video pauses, how many seconds should it wait before creating a calendar event?
wait_time=300
```

List of Color_Ids can be found [here](https://google-calendar-simple-api.readthedocs.io/en/latest/colors.html#event-colors)
