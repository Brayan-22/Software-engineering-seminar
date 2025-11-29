-- Drop tables if they exist (for clean re-initialization)
DROP TABLE IF EXISTS professor_courses CASCADE;
DROP TABLE IF EXISTS courses CASCADE;
DROP TABLE IF EXISTS professors CASCADE;

-- ===================================================================
-- TABLE: professors
-- ===================================================================
-- Stores information about professors/instructors in the system
-- ===================================================================
CREATE TABLE professors (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    specialty VARCHAR(255),

    -- Timestamps (optional but recommended)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for professors table
CREATE INDEX idx_professors_email ON professors(email);
CREATE INDEX idx_professors_name ON professors(name);
CREATE INDEX idx_professors_specialty ON professors(specialty);

-- Comments
COMMENT ON TABLE professors IS 'Stores professor/instructor information';
COMMENT ON COLUMN professors.id IS 'Primary key - Auto-incremented ID';
COMMENT ON COLUMN professors.name IS 'Full name of the professor';
COMMENT ON COLUMN professors.email IS 'Email address (unique)';
COMMENT ON COLUMN professors.specialty IS 'Academic specialty or field of expertise';


-- ===================================================================
-- TABLE: courses
-- ===================================================================
-- Stores information about courses offered in the system
-- ===================================================================
CREATE TABLE courses (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) NOT NULL UNIQUE,
    schedule VARCHAR(100),

    -- Timestamps (optional but recommended)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for courses table
CREATE INDEX idx_courses_code ON courses(code);
CREATE INDEX idx_courses_name ON courses(name);
CREATE INDEX idx_courses_schedule ON courses(schedule);

-- Comments
COMMENT ON TABLE courses IS 'Stores course information';
COMMENT ON COLUMN courses.id IS 'Primary key - Auto-incremented ID';
COMMENT ON COLUMN courses.name IS 'Course name';
COMMENT ON COLUMN courses.code IS 'Unique course code (e.g., CS101, MATH201)';
COMMENT ON COLUMN courses.schedule IS 'Course schedule (e.g., "Mon/Wed 10:00-12:00")';


-- ===================================================================
-- TABLE: professor_courses
-- ===================================================================
-- Junction table for many-to-many relationship between professors and courses
-- Stores assignment information
-- ===================================================================
CREATE TABLE professor_courses (
    id SERIAL PRIMARY KEY,
    professor_id INTEGER NOT NULL,
    course_id INTEGER NOT NULL,
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) DEFAULT 'active',

    -- Timestamps (optional but recommended)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    -- Foreign key constraints with CASCADE DELETE
    CONSTRAINT fk_professor_courses_professor
        FOREIGN KEY (professor_id)
        REFERENCES professors(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT fk_professor_courses_course
        FOREIGN KEY (course_id)
        REFERENCES courses(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    -- Unique constraint to prevent duplicate assignments
    CONSTRAINT uq_professor_course_assignment
        UNIQUE (professor_id, course_id),

    -- Check constraint for status values
    CONSTRAINT chk_professor_courses_status
        CHECK (status IN ('active', 'inactive', 'pending', 'completed'))
);

-- Indexes for professor_courses table
CREATE INDEX idx_professor_courses_professor_id ON professor_courses(professor_id);
CREATE INDEX idx_professor_courses_course_id ON professor_courses(course_id);
CREATE INDEX idx_professor_courses_status ON professor_courses(status);
CREATE INDEX idx_professor_courses_assigned_at ON professor_courses(assigned_at DESC);

-- Composite index for common queries
CREATE INDEX idx_professor_courses_composite ON professor_courses(professor_id, course_id, status);

-- Comments
COMMENT ON TABLE professor_courses IS 'Junction table for professor-course assignments';
COMMENT ON COLUMN professor_courses.id IS 'Primary key - Auto-incremented ID';
COMMENT ON COLUMN professor_courses.professor_id IS 'Foreign key to professors table';
COMMENT ON COLUMN professor_courses.course_id IS 'Foreign key to courses table';
COMMENT ON COLUMN professor_courses.assigned_at IS 'Timestamp when the assignment was created';
COMMENT ON COLUMN professor_courses.status IS 'Assignment status: active, inactive, pending, completed';


-- ===================================================================
-- TRIGGERS: Auto-update updated_at timestamp
-- ===================================================================

-- Function to update updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for professors table
CREATE TRIGGER update_professors_updated_at
    BEFORE UPDATE ON professors
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger for courses table
CREATE TRIGGER update_courses_updated_at
    BEFORE UPDATE ON courses
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger for professor_courses table
CREATE TRIGGER update_professor_courses_updated_at
    BEFORE UPDATE ON professor_courses
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();


-- ===================================================================
-- SEED DATA (Optional - Sample data for testing)
-- ===================================================================

-- Insert sample professors
INSERT INTO professors (name, email, specialty) VALUES
    ('Dr. John Smith', 'john.smith@university.edu', 'Computer Science'),
    ('Dr. Maria Garcia', 'maria.garcia@university.edu', 'Mathematics'),
    ('Dr. Robert Chen', 'robert.chen@university.edu', 'Physics'),
    ('Dr. Sarah Johnson', 'sarah.johnson@university.edu', 'Computer Science'),
    ('Dr. Ahmed Hassan', 'ahmed.hassan@university.edu', 'Data Science');

-- Insert sample courses
INSERT INTO courses (name, code, schedule) VALUES
    ('Introduction to Programming', 'CS101', 'Mon/Wed/Fri 09:00-10:00'),
    ('Calculus I', 'MATH101', 'Tue/Thu 10:00-11:30'),
    ('Data Structures', 'CS201', 'Mon/Wed 14:00-15:30'),
    ('Linear Algebra', 'MATH201', 'Tue/Thu 13:00-14:30'),
    ('Physics I', 'PHYS101', 'Mon/Wed/Fri 11:00-12:00'),
    ('Machine Learning', 'CS301', 'Tue/Thu 15:00-16:30'),
    ('Calculus II', 'MATH102', 'Mon/Wed 10:00-11:30'),
    ('Database Systems', 'CS202', 'Tue/Thu 09:00-10:30'),
    ('Statistics', 'MATH301', 'Mon/Wed/Fri 13:00-14:00'),
    ('Advanced Algorithms', 'CS401', 'Tue/Thu 16:00-17:30');

-- Insert sample professor-course assignments
INSERT INTO professor_courses (professor_id, course_id, status) VALUES
    -- Dr. John Smith teaches CS courses
    (1, 1, 'active'),  -- CS101
    (1, 3, 'active'),  -- CS201
    (1, 8, 'active'),  -- CS202

    -- Dr. Maria Garcia teaches Math courses
    (2, 2, 'active'),  -- MATH101
    (2, 4, 'active'),  -- MATH201
    (2, 7, 'active'),  -- MATH102

    -- Dr. Robert Chen teaches Physics
    (3, 5, 'active'),  -- PHYS101

    -- Dr. Sarah Johnson teaches advanced CS
    (4, 6, 'active'),  -- CS301 (Machine Learning)
    (4, 10, 'active'), -- CS401 (Advanced Algorithms)

    -- Dr. Ahmed Hassan teaches Data Science and Statistics
    (5, 6, 'active'),  -- CS301 (Machine Learning) - co-teaching
    (5, 9, 'active');  -- MATH301 (Statistics)


