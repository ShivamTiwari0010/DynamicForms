# Dynamic Form builder


Project Documentation: Angular Dynamic Form Builder
    1. Project Overview
        This project is a Dynamic Form Builder built using Angular. It allows users to create, edit, and submit multi-step forms dynamically. The application is designed to be modular, scalable, and optimized for performance.

    2. Technologies Used
        •	Frontend: Angular (Latest Stable Version)
        •	State Management: Service-based state management
        •	UI Framework: Bootstrap 5
        •	Component-based Architecture: Modular Angular components
        •	Data Storage: Session Storage (For saving forms temporarily)
        •	Change Detection Optimization: ChangeDetectionStrategy.OnPush
        •	Validation & Forms: Reactive Forms
        •	Performance Enhancements: Lazy Loading, trackBy, OnPush, Debouncing
        •	UX Enhancements: Toaster messages, error handling

    3. Features
        3.1. Dynamic Form Creation
            •	Users can define a form name and specify the number of steps.
            •	Each step allows the addition of multiple fields.
            •	Supported field types: 
            •	Text Input
            •	Email Input
            •	Number Input
            •	Date Input
            •	Dropdown (Supports multiple options)
            •	Radio Buttons (Supports multiple options)
            •	Checkboxes (Supports Single or Multi-Select options)
            •	Fields can be marked as Required.
        3.2. Multi-Step Navigation
            •	Users can navigate between steps using Back/Next buttons.
            •	Steps are validated before progressing to the next step.
            •	Validation triggers when the user moves between steps.
        3.3. Form Submission & Validation
            •	Validation checks ensure all required fields are filled before submission.
            •	If all fields are optional, the form remains disabled until at least one field is filled.
            •	Forms are saved in session storage for easy retrieval.
        3.4. Viewing & Editing Submissions
            •	Users can view past submissions.
            •	The system supports editing submissions with pre-filled data.
            •	If the form is edited, a confirmation prompt ensures users don’t lose progress.
        3.5. Performance Optimizations
            •	Lazy Loading: Ensures faster initial page loads.
            •	Change Detection: ChangeDetectionStrategy.OnPush minimizes unnecessary re-renders.
            •	trackBy Implementation: Improves performance for lists and loops.
            •	Efficient Form Validation: Trigger validation only when required.

    4. Working Mechanism
        4.1. Form Creation Workflow
            1.	User Defines Form Details (Form Name, Step Count)
            2.	User Adds Steps & Fields 
                •	Each field requires a label and type.
                •	Dropdown, Checkbox, and Radio fields require options.
            3.	User Navigates Through Steps 
                •	Steps are validated before progressing.
            4.	User Saves the Form 
                •	The form structure is stored in session storage.
        4.2. Form Submission Workflow
            1.	User Fills the Form 
                •	Pre-filled data is available when editing.
                •	Validation is enforced based on field types and requirements.
            2.	User Saves the Submission 
                •	The form data is stored in session storage.
                •	A success message is displayed.
        4.3. Data Handling & Storage
            •	Forms are stored in session storage under savedForms.
            •	Submissions are stored under savedFormData with the form name as the key.
            •	Upon deletion, both the form structure and its submissions are removed.

    5. Other Features
        •	Auto-remove empty fields when navigating steps.
        •	Toaster notifications for form creation errors (e.g., duplicate form names).
        •	Dynamic Save Button Behaviour: 
        •	Disabled unless all required fields are filled.
        •	If no fields are required, the button is disabled until at least one field is filled.
        •	Auto-formatting for Date Fields.
        •	Validation Triggers when switching steps 

    6. Enhancements & Scalability
        6.1. Future Enhancements
            •	Global State Management 
            •	Backend API Integration for permanent data storage.
            •	Enhanced UI/UX with animations and transitions.
            •	Role-based Access Control for managing forms.
        6.2. Scalability Considerations
            •	The modular design allows easy expansion.
            •	The component-based architecture ensures reusability.
            •	Optimized rendering improves performance for large datasets.

    7. Conclusion
        This project successfully meets the requirements for a dynamic, scalable, and optimized Angular application. The robust validation, dynamic form handling, and performance enhancements make it a highly efficient system for managing multi-step forms. Future enhancements can further improve the scalability and user experience.




This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 18.0.4.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
