from flask import Blueprint, request, jsonify
from models import Event, User, Venue
from mongoengine import DoesNotExist
from datetime import datetime

event_bp = Blueprint('event_bp', __name__, url_prefix='/api/events')


# ------------------------
# Get all events for an organizer
# ------------------------
@event_bp.route('/organizer/<organizer_id>', methods=['GET'])
def get_my_events(organizer_id):
    try:
        organizer = User.objects.get(id=organizer_id)
        events = Event.objects(organizer_id=organizer)
        events_list = []
        for event in events:
            events_list.append({
                "id": str(event.id),
                "title": event.title,
                "description": event.description,
                "category": event.category,
                "venue": event.venue,
                "venue_id": str(event.venue_id.id),
                "date": event.date,
                "start_time": event.start_time,
                "end_time": event.end_time,
                "max_participants": event.max_participants,
                "registrations_count": event.registrations_count,
                "status": event.status,
                "gform_link": event.gform_link,
                "gspreadsheet_link": event.gspreadsheet_link,
                "image_url": event.image_url,
                "phone_number": event.phone_number,
                "mail_id": event.mail_id,
            })
        return jsonify(events_list), 200
    except DoesNotExist:
        return jsonify({"error": "Organizer not found"}), 404


# ------------------------
# Create new event
# ------------------------
@event_bp.route('/', methods=['POST'])
def create_event():
    data = request.get_json()
    try:
        organizer = User.objects.get(id=data['organizer_id'])
        venue = Venue.objects.get(id=data['venue_id'])

        event = Event(
            organizer_id=organizer,
            title=data['title'],
            description=data.get('description', ''),
            category=data.get('category', ''),
            venue_id=venue,
            venue=venue.venue_name,  # string display
            date=data['date'],
            start_time=data['start_time'],
            end_time=data['end_time'],
            max_participants=data['max_participants'],
            status=data.get('status', 'Green'),
            gform_link=data.get('gform_link', ''),
            gspreadsheet_link=data.get('gspreadsheet_link', ''),
            image_url=data.get('image_url', ''),
            phone_number=data.get('phone_number', organizer.reg_no),
            mail_id=data.get('mail_id', organizer.email)
        )
        event.save()
        return jsonify({"message": "Event created successfully", "event_id": str(event.id)}), 201

    except DoesNotExist as e:
        return jsonify({"error": "Organizer or Venue not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 400
