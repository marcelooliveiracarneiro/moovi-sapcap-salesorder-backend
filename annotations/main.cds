using { MainService } from '../srv/main';

annotate MainService.SaledOrderHeaders with @(
    UI: {
        SelectionFields  : [
            id,
            totalAmount,
            customer_id,
            status_id,
            createdAt,
            createdBy,
            modifiedAt,
            modifiedBy
        ],
        LineItem  : [
         {
            $Type: 'UI.DataField',
            Value: id,
            ![@HTML5.CssDefaults] : {
                $Type : 'HTML5.CssDefaultsType',
                width: '10rem'
            }
         },
         {
            $Type: 'UI.DataField',
            Value: totalAmount,
            ![@HTML5.CssDefaults] : {
                $Type : 'HTML5.CssDefaultsType',
                width: '10rem'
            }
            
         },
         {
            $Type: 'UI.DataField',
            Label: 'Cliente',
            Value: customer_id,
            ![@HTML5.CssDefaults] : {
                $Type : 'HTML5.CssDefaultsType',
                width: '10rem'
            }
         },
         {
            $Type: 'UI.DataField',
            Label: 'Status',
            Value: status_id,
            Criticality: ((status.id = 'COMPLETED') ? 3 : ((status.id = 'PENDING') ? 2 : 1 ) ),
            CriticalityRepresentation: #WithoutIcon,
            ![@HTML5.CssDefaults] : {
                $Type : 'HTML5.CssDefaultsType',
                width: '10rem'
            }
         },
         {
            $Type: 'UI.DataField',
            Value: createdAt,
            ![@HTML5.CssDefaults] : {
                $Type : 'HTML5.CssDefaultsType',
                width: '15rem'
            }
            
         },
         {
            $Type: 'UI.DataField',
            Value: createdBy,
            ![@HTML5.CssDefaults] : {
                $Type : 'HTML5.CssDefaultsType',
                width: '15rem'
            }
            
         }   

        ]
    }
) {
    id @title : 'Id';
    totalAmount @title : 'Valor Total';
    createdAt @title : 'Data de Criação';
    createdBy @title : 'Criado por'  ;
    customer @(
        title  : 'Cliente',
        Common : {
            Label: 'Cliente',
            Text : customer.firstName,
            ValueList : {
                $Type : 'Common.ValueListType',
                CollectionPath : 'Customers',
                Parameters: [
                    {
                        $Type: 'Common.ValueListParameterInOut',
                        ValueListProperty: 'id',
                        LocalDataProperty: 'customer_id'
                    },
                    {
                        $Type: 'Common.ValueListParameterDisplayOnly',
                        ValueListProperty: 'firstName'
                    },
                    {
                        $Type: 'Common.ValueListParameterDisplayOnly',
                        ValueListProperty: 'lastName'
                    },
                    {
                        $Type: 'Common.ValueListParameterDisplayOnly',
                        ValueListProperty: 'email'
                    }

                ]
            },
        }
    );
    status @(
        title: 'status',
        
        Common : {
            Label: 'Status',
            Text : status.description,
            TextArrangement : #TextOnly,
            ValueListWithFixedValues,
            ValueList : {
                $Type : 'Common.ValueListType',
                CollectionPath : 'SaledOrderStatuses',
                Parameters: [
                    {
                        $Type: 'Common.ValueListParameterInOut',
                        ValueListProperty: 'id',
                        LocalDataProperty: 'status_id'
                    },
                    {
                        $Type: 'Common.ValueListParameterDisplayOnly',
                        ValueListProperty: 'description'
                    }
                ]
            },
        }

    )
};

annotate MainService.SaledOrderStatuses with {
    id @Common.Text: description @Common.TextArrangement: #TextOnly
}