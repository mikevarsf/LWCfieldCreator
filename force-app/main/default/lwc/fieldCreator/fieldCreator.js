import { LightningElement, api, track } from 'lwc'
import { ShowToastEvent } from 'lightning/platformShowToastEvent'
import createCustomField from '@salesforce/apex/FieldCreatorController.createCustomField'

export default class FieldCreator extends LightningElement {
    @api objectApiName
    showSpinner = false
    latestFieldId = ''

    FIELD_TYPES = [
        { value: 'Text', label: 'Text' },
        { value: 'Checkbox', label: 'Checkbox' },
        { value: 'LongTextArea', label: 'Long Text Area' }
    ]

    @track newFieldSchema = {
        required: false,
        apiName: '',
        label: '',
        defaultValue: '',
        visibleLines: null,
        length: 255,
        type: 'Text'
    }

    connectedCallback() {
        if (this.objectApiName) {
            this.newFieldSchema.objectApiName = this.objectApiName
        }
    }

    handleInputChange(event) {
        const attrName = event.target.name
        this.newFieldSchema[attrName] = event.detail.value

        if (attrName === 'label') {
            this.newFieldSchema.apiName = event.detail.value.replace(/ /g, '_')
        }
    }

    async handleCreateNewField() {
        const payload = {
            Metadata: {
                type: this.newFieldSchema.type,
                label: this.newFieldSchema.label,
                length: this.newFieldSchema.length,
                visibleLines: this.newFieldSchema.visibleLines,
                required: this.newFieldSchema.required,
                description: this.newFieldSchema.description,
                inlineHelpText: this.newFieldSchema.inlineHelpText
            }
        }

        payload.FullName =
            this.newFieldSchema.objectApiName + '.' + this.newFieldSchema.apiName + '__c'
        console.log('newFieldSchema ', JSON.stringify(payload))

        this.showSpinner = true
        try {
            const result = await createCustomField({
                metadata: JSON.stringify(payload)
            })

            const fieldId = JSON.parse(result).id
            this.latestFieldId = fieldId

            this.showNotification('New field has been created', `New field Id: ${JSON.parse(result).id}`, 'success')
        } catch (error){
            this.showNotification('Error', error.message, 'error')
        }
    
        this.showSpinner = false
    }

    showNotification(title, message, variant) {
        const evt = new ShowToastEvent({
            title,
            message,
            variant
        })
        this.dispatchEvent(evt)
    }

    get latestFieldUrl(){
        return `/lightning/setup/ObjectManager/${this.newFieldSchema.objectApiName}/FieldsAndRelationships/${this.latestFieldId}/view`
    }
}