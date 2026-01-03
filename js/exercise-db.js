// Exercise database with images for workout generation
const PLACEHOLDER_IMAGE = 'assets/images/exercise-placeholder.svg';
const LOCAL_IMAGE_MAP = {
  'Squats': 'Bodyweight_Squat',
  'Push-ups': 'Pushups',
  'Push-Ups': 'Pushups',
  'Deadlifts': 'Barbell_Deadlift',
  'Deadlift': 'Barbell_Deadlift',
  'Pull-ups': 'Pullups',
  'Pull-Ups': 'Pullups',
  'Bench Press': 'Barbell_Bench_Press_-_Medium_Grip',
  'Lunges': 'Dumbbell_Lunges',
  'Planks': 'Plank',
  'Plank': 'Plank',
  'Dumbbell Rows': 'Bent_Over_Two-Dumbbell_Row',
  'Shoulder Press': 'Dumbbell_Shoulder_Press',
  'Leg Press': 'Leg_Press',
  'Bicep Curls': 'Dumbbell_Alternate_Bicep_Curl',
  'Tricep Dips': 'Bench_Dips',
  'Dips': 'Bench_Dips',
  'Lat Pulldown': 'Wide-Grip_Lat_Pulldown',
  'Mountain Climbers': 'Mountain_Climbers',
  'Box Jumps': 'Box_Jump_Multiple_Response',
  'Russian Twists': 'Russian_Twist',
  'Incline Push-ups': 'Incline_Push-Up',
  'Crunches': 'Crunches',
  'Sit-ups': 'Sit-Up',
  'Rowing': 'Rowing_Stationary',
  'Running': 'Running_Treadmill',
  'Cycling': 'Bicycling_Stationary',
  'Étirements': 'Hamstring_Stretch',
  // Fallback mappings for names not in dataset
  'Burpees': 'Box_Jump_Multiple_Response',
  'Jumping Jacks': 'Mountain_Climbers',
  'Leg Raises': 'Crunches'
};

function slugifyExerciseName(name) {
  return name
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // strip accents
    .replace(/\s+/g, '_')
    .replace(/[^A-Za-z0-9_-]/g, '_');
}

function buildExerciseImagePath(name) {
  const mapped = LOCAL_IMAGE_MAP[name];
  const slug = mapped || slugifyExerciseName(name);
  return `assets/images/exercises/${slug}/0.jpg`;
}
const EXERCISE_DATABASE = {
  'Squats': {
    name: 'Squats',
    image: PLACEHOLDER_IMAGE,
    muscle: 'Legs',
    difficulty: 'Intermediate'
  },
  'Push-ups': {
    name: 'Push-ups',
    image: PLACEHOLDER_IMAGE,
    muscle: 'Chest',
    difficulty: 'Beginner'
  },
  'Push-Ups': {
    name: 'Push-Ups',
    image: PLACEHOLDER_IMAGE,
    muscle: 'Chest',
    difficulty: 'Beginner'
  },
  'Deadlifts': {
    name: 'Deadlifts',
    image: PLACEHOLDER_IMAGE,
    muscle: 'Back',
    difficulty: 'Advanced'
  },
  'Deadlift': {
    name: 'Deadlift',
    image: PLACEHOLDER_IMAGE,
    muscle: 'Back',
    difficulty: 'Advanced'
  },
  'Pull-ups': {
    name: 'Pull-ups',
    image: PLACEHOLDER_IMAGE,
    muscle: 'Back',
    difficulty: 'Advanced'
  },
  'Pull-Ups': {
    name: 'Pull-Ups',
    image: PLACEHOLDER_IMAGE,
    muscle: 'Back',
    difficulty: 'Advanced'
  },
  'Bench Press': {
    name: 'Bench Press',
    image: PLACEHOLDER_IMAGE,
    muscle: 'Chest',
    difficulty: 'Intermediate'
  },
  'Lunges': {
    name: 'Lunges',
    image: PLACEHOLDER_IMAGE,
    muscle: 'Legs',
    difficulty: 'Beginner'
  },
  'Planks': {
    name: 'Planks',
    image: PLACEHOLDER_IMAGE,
    muscle: 'Core',
    difficulty: 'Beginner'
  },
  'Plank': {
    name: 'Plank',
    image: PLACEHOLDER_IMAGE,
    muscle: 'Core',
    difficulty: 'Beginner'
  },
  'Dumbbell Rows': {
    name: 'Dumbbell Rows',
    image: PLACEHOLDER_IMAGE,
    muscle: 'Back',
    difficulty: 'Intermediate'
  },
  'Shoulder Press': {
    name: 'Shoulder Press',
    image: PLACEHOLDER_IMAGE,
    muscle: 'Shoulders',
    difficulty: 'Intermediate'
  },
  'Leg Press': {
    name: 'Leg Press',
    image: PLACEHOLDER_IMAGE,
    muscle: 'Legs',
    difficulty: 'Beginner'
  },
  'Bicep Curls': {
    name: 'Bicep Curls',
    image: PLACEHOLDER_IMAGE,
    muscle: 'Arms',
    difficulty: 'Beginner'
  },
  'Tricep Dips': {
    name: 'Tricep Dips',
    image: PLACEHOLDER_IMAGE,
    muscle: 'Arms',
    difficulty: 'Intermediate'
  },
  'Dips': {
    name: 'Dips',
    image: PLACEHOLDER_IMAGE,
    muscle: 'Arms',
    difficulty: 'Intermediate'
  },
  'Lat Pulldown': {
    name: 'Lat Pulldown',
    image: PLACEHOLDER_IMAGE,
    muscle: 'Back',
    difficulty: 'Beginner'
  },
  'Leg Raises': {
    name: 'Leg Raises',
    image: PLACEHOLDER_IMAGE,
    muscle: 'Core',
    difficulty: 'Intermediate'
  },
  'Mountain Climbers': {
    name: 'Mountain Climbers',
    image: PLACEHOLDER_IMAGE,
    muscle: 'Cardio',
    difficulty: 'Intermediate'
  },
  'Burpees': {
    name: 'Burpees',
    image: PLACEHOLDER_IMAGE,
    muscle: 'Full Body',
    difficulty: 'Advanced'
  },
  'Jumping Jacks': {
    name: 'Jumping Jacks',
    image: PLACEHOLDER_IMAGE,
    muscle: 'Cardio',
    difficulty: 'Beginner'
  },
  'Box Jumps': {
    name: 'Box Jumps',
    image: PLACEHOLDER_IMAGE,
    muscle: 'Legs',
    difficulty: 'Advanced'
  },
  'Russian Twists': {
    name: 'Russian Twists',
    image: PLACEHOLDER_IMAGE,
    muscle: 'Core',
    difficulty: 'Intermediate'
  },
  'Incline Push-ups': {
    name: 'Incline Push-ups',
    image: PLACEHOLDER_IMAGE,
    muscle: 'Chest',
    difficulty: 'Beginner'
  },
  'Crunches': {
    name: 'Crunches',
    image: PLACEHOLDER_IMAGE,
    muscle: 'Core',
    difficulty: 'Beginner'
  },
  'Sit-ups': {
    name: 'Sit-ups',
    image: PLACEHOLDER_IMAGE,
    muscle: 'Core',
    difficulty: 'Beginner'
  },
  'Sit-Ups': {
    name: 'Sit-Ups',
    image: PLACEHOLDER_IMAGE,
    muscle: 'Core',
    difficulty: 'Beginner'
  },
  'Rowing': {
    name: 'Rowing',
    image: PLACEHOLDER_IMAGE,
    muscle: 'Cardio',
    difficulty: 'Intermediate'
  },
  'Running': {
    name: 'Running',
    image: PLACEHOLDER_IMAGE,
    muscle: 'Cardio',
    difficulty: 'Beginner'
  },
  'Cycling': {
    name: 'Cycling',
    image: PLACEHOLDER_IMAGE,
    muscle: 'Cardio',
    difficulty: 'Beginner'
  },
  'Étirements': {
    name: 'Étirements',
    image: PLACEHOLDER_IMAGE,
    muscle: 'Flexibility',
    difficulty: 'Beginner'
  }
};

function getExerciseData(exerciseName) {
  // Try exact match first
  if (EXERCISE_DATABASE[exerciseName]) {
    const data = EXERCISE_DATABASE[exerciseName];
    const imagePath = data.image === PLACEHOLDER_IMAGE ? buildExerciseImagePath(data.name || exerciseName) : (data.image || PLACEHOLDER_IMAGE);
    return { ...data, image: imagePath };
  }
  
  // Try case-insensitive match
  const key = Object.keys(EXERCISE_DATABASE).find(k => 
    k.toLowerCase() === exerciseName.toLowerCase()
  );
  
  if (key) {
    const data = EXERCISE_DATABASE[key];
    const imagePath = data.image === PLACEHOLDER_IMAGE ? buildExerciseImagePath(data.name || key) : (data.image || PLACEHOLDER_IMAGE);
    return { ...data, image: imagePath };
  }
  
  // Return null if not found
  return null;
}

function getAllExerciseNames() {
  return Object.keys(EXERCISE_DATABASE);
}
