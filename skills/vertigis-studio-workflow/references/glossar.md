# Glossary (WORKG IN PROGRESS)

## activities

The building blocks of a workflow. Each activity represents a unit of work, for example, querying a layer, prompting the user, or setting the map extent.

See also activity inputs

## activity ID

The ID that uniquely identifies an activity in a workflow. The ID is used to access an activity's outputs from other activities. For example, the expression =$prompt1.result is the result output of the activity with ID prompt1. An ID is always preceded by a dollar sign ($) in an expression.

## activity inputs

Configurable properties of an activity that the activity operates on. Most activities also have outputs, which are the results of the activity's operation. Values are propagated through the workflow by using the output of one activity as the input to another activity.

See also expression, activity ID

## API

An acronym for Application Programming Interface, which is a software intermediary that allows two applications to talk to each other.

## author

Someone who creates or modifies workflows. A workflow can have multiple authors.

## client application

An application run by an end-user. A client application that is configured to run one or more workflows is a host application.

## client workflow

A workflow that runs in a client (host) application such as VertiGIS Studio Web, VertiGIS Studio Mobile, or ArcGIS Web AppBuilder. Client workflows can interact with the user through forms and other activities.

See also server workflow

## cloud Workflow

Cloud Workflow is the Software as a Service (SaaS) offering of VertiGIS Studio Workflow, in which you access VertiGIS Studio Workflow as a service over the Internet instead of having it installed on your own server. Cloud Workflow does not support server workflows.

See also on-premises Workflow

## Dashboard

The Dashboard is the screen you see when you first sign in to Workflow Designer. The Dashboard lists the templates that you can use to create new workflows, as well as your existing workflows, starting with the most recently edited.

## data directory

The folder where VertiGIS Studio Workflow stores the files related to an on-premises installation, for example, configuration files and server workflows. The data directory is specified in the Post Installer when VertiGIS Studio Workflow is first installed.

## design surface

The area in Workflow Designer where you design workflows. To design a workflow, you drag activities from the Toolbox to the design surface, connect the activities into a flowchart, and configure the activities' properties.

## event

A change to a form element, for example, a form element loading in the user's browser (a load event) or the user entering some input (a change event). To respond to an event, configure a subworkflow for the event. When the event occurs in the running workflow, the event's subworkflow runs.

## expression

A string that evaluates to a value when the workflow runs. Expressions are used to configure activity inputs. Expressions in VertiGIS Studio Workflow always start with an equals sign (=). VertiGIS Studio Workflow uses JavaScript expressions.

See also activity ID

## flowchart

The diagram of a workflow shown on Workflow Designer's design surface. The flowchart consists of activities connected by arrows to show the order in which the workflow runs.

## form

The part of a workflow that gathers input from the user. To add a form to a workflow, add a Display Form activity and use the built-in Form Designer to design the form. A workflow can have multiple forms.

See also form element

## Form Designer

The part of Workflow Designer used to design forms in Display Form activities. Double-click a Display Form activity in the flowchart to view a preview of the form in Form Designer. To design the form, drag form elements from the Toolbox to the preview.

## form elements

The building blocks of a form in a Display Form activity. Most form elements gather input from the user, for example, a Text Box gets a line of text and a Geometry Picker gets geometries on a map. The Display Form activity has outputs for each form element that enable you to access the user's inputs.

## host application

An application that can run one or more workflows. To host a workflow, you configure a method for the application to run the workflow, such as a menu item. The end user clicks the item to run the workflow.

See also client application, Workflow widget

## My Term

My definition

## Navigator

A feature of Workflow Designer that shows the complete workflow in one place, including its subworkflows. Click any activity in the Navigator to navigate the flowchart to that activity. To open the Navigator, click Navigator at the bottom of Workflow Designer.

## on-premises Workflow

An installation of VertiGIS Studio Workflow on your own server. An on-premises Workflow install contains a separate copy of the entire SaaS environment. This means that you control access to the server and that you are responsible for any software updates.

See also cloud Workflow

## Post Installer

The desktop application used to configure various aspects of an on-premises VertiGIS Studio Workflow installation, for example, the portal where client workflows are stored and the data directory where server workflows are stored.

## Properties panel

A panel in Workflow Designer that shows the properties of the selected activity, including its ID, inputs, and outputs. In Form Designer, the Properties panel shows the properties of the selected form element.

## Sandbox

VertiGIS Studio Workflow's built-in test environment, accessed from Workflow Designer. Use the Sandbox to run a workflow with its most recent changes, without having to save the workflow first.

## server workflow

A workflow that runs on an on-premises Workflow server, instead of on a client. Server workflows have different capabilities than client workflows, like querying databases, managing files on the server, and sending email. Server workflows cannot interact with the user.

## subworkflow

A workflow within a workflow. Events have a subworkflow, as do some activities, like the Container and For Each activities. A workflow can have many levels of subworkflows nested within each other.

## Toolbox

A collection of activities in Workflow Designer that you can use to build workflows. In the Form Designer, the Toolbox shows form elements instead of activities.

## user input

Input gathered from the user using Display Form activities.

See also form elements, workflow input, activity input

## UTC

Similar to Greenwich Mean Time. The UK is 0, New York is UTC-5, and the Netherlands is UTC+1.

## validation of a workflow

An evaluation whether a workflow contains any problems, for example, required activity inputs that have not been configured. To open the Validation panel, click Problems at the bottom of Workflow Designer. Click an error or warning message to navigate to the activity causing the problem.

See also validation of user input

## validation of user input

An evaluation whether the user's input meets expectations, for example, the input fits the expected pattern for a date or telephone number. The simplest validation you can configure is setting a form element to be required. You can do custom validation using a validate event.

See also validation of a workflow

## verbose log

A log of the actual input values that each activity in a client workflow operates on and the output values that they produce. The information is written to the browser console or log viewer when you run the workflow. This provides a trace of the running workflow that you can use to debug the workflow.

## workflow

A collection of connected activities and forms that automates custom business processes. VertiGIS Studio Workflow provides activities to perform spatial analysis, query databases, manipulate a map and its features, and more.

See also client workflow, server workflow

## Workflow Designer

A web-based application used to create VertiGIS Studio workflows.

See also design surface

## workflow input

An input passed from the host application to the running workflow. If you know the value of an input in advance you can configure it in the host application. You can also pass the user's current selection as an input, for example, the current search or identify results.

See also user input, activity inputs

## workflow output

An output passed from one workflow to another workflow. When one workflow (w1) runs another workflow (w2) using a Run Workflow activity, w2 can pass back outputs to w1. A client workflow can run another client workflow or a server workflow.

## Workflow Server

A service included with on-premises Workflow that allows you to perform actions specific to a server, such as interacting with databases or sending emails.

See also on-premises Workflow

## Workflow widget

An ArcGIS Web AppBuilder (Developer Edition) widget that runs a VertiGIS Studio workflow in a Web AppBuilder app. Workflow widgets are configurable to run any client workflow. To run the workflow, the user clicks the widget in the running app.