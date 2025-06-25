using { MainService } from '../srv/routes/main';

annotate MainService.SaledOrderHeaders with @(
    Capabilities: {
        DeleteRestrictions : {
            $Type : 'Capabilities.DeleteRestrictionsType',
            Deletable: false,
        },
        UpdateRestrictions : {
            $Type : 'Capabilities.UpdateRestrictionsType',
            Updatable: false,
        },
        FilterFunctions : [
            'tolower',
        ],
        FilterRestrictions : {
            $Type : 'Capabilities.FilterRestrictionsType',
            FilterExpressionRestrictions: [
                {
                    Property: createdAt,
                    AllowedExpressions: 'SingleRange'
                },
                {
                    Property: modifiedAt,
                    AllowedExpressions: 'SingleRange'
                },
            ]
        },
    },
    UI: {
        SelectionFields  : [
            id,
            totalAmount,
            customer_id,
            status_id,
            createdAt,
            modifiedAt,
        ],
        HeaderInfo  : {
            $Type : 'UI.HeaderInfoType',
            TypeName : 'Pedido',
            TypeNamePlural : 'Pedidos',
            Title: {
                $Type: 'UI.DataField',
                Value: 'Id: {id}' 
            }
        },
        LineItem  : [
         {
            $Type: 'UI.DataField',
            Value: id,
            ![@HTML5.CssDefaults] : {
                $Type : 'HTML5.CssDefaultsType',
                width: '18rem'
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

        ],
        Facets  : [
            {
                ID: 'salesOrderData',
                $Type: 'UI.CollectionFacet',
                Label: 'Informações do Cabeçalho do Pedido',
                Facets: [
                    { 
                        ID: 'header',
                        $Type: 'UI.ReferenceFacet',
                        Target: '@UI.FieldGroup#Header',
                    }
                ]
            },
            {
                ID: 'customerData',
                $Type: 'UI.ReferenceFacet',
                Label: 'Informações do Cliente',
                Target: 'customer/@UI.FieldGroup#CustomerData'
            },
            {
                ID: 'salesOrderItemData',
                $Type: 'UI.ReferenceFacet',
                Label: 'Items',
                Target: 'items/@UI.LineItem'
            }

        ],
        FieldGroup#Header  : {
            $Type : 'UI.FieldGroupType',
            Data: [
                {
                    $Type: 'UI.DataField',
                    Value: id,
                },
                {
                    $Type: 'UI.DataField',
                    Value: totalAmount,
                },
                {
                    $Type: 'UI.DataField',
                    Value: createdAt,
                },
                {
                    $Type: 'UI.DataField',
                    Value: createdBy,
                }
            ]
        },

    }
) {
    id @title : 'Id';
    totalAmount @title : 'Valor Total';
    createdAt @title : 'Data de Criação';
    createdBy @title : 'Criado por'  ;
    modifiedAt @title : 'Data de Alteração';
    modifiedBy @title : 'Alterado por';
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

annotate MainService.Customers with @(
    UI: {
        FieldGroup#CustomerData : {
            $Type : 'UI.FieldGroupType',
            Data: [
                {
                    $Type: 'UI.DataField',
                    Value: id,
                },
                {
                    $Type: 'UI.DataField',
                    Value: firstName,
                },
                {
                    $Type: 'UI.DataField',
                    Value: lastName,
                },
                {
                    $Type: 'UI.DataField',
                    Value: email,
                }
            ]
        },
    }
) {
    id @title : 'Id';
    firstName @title : 'Nome';
    lastName @title : 'Sobrenome';
    email @title : 'E-mail';
};

annotate MainService.SaledOrderItems with @(
    UI: {
        LineItem  : [
            {
                $Type: 'UI.DataField',
                Value: id,
                ![@HTML5.CssDefaults] : {
                    $Type : 'HTML5.CssDefaultsType',
                    width: '18rem'
                }
            },
            {
                $Type: 'UI.DataField',
                Value: price,
                
            },
            {
                $Type: 'UI.DataField',
                Value: quantity,
            },
            {
                $Type: 'UI.DataField',
                Value: product.name,
                ![@HTML5.CssDefaults] : {
                    $Type : 'HTML5.CssDefaultsType',
                    width: '18rem'
                }
            }
       ],
    }
) {
    id @title : 'Id';
    price @title : 'Preço';
    quantity @title : 'Qtd.';
    header @UI.Hidden @UI.HiddenFilter;
    createdAt @UI.Hidden @UI.HiddenFilter;
    createdBy @UI.Hidden @UI.HiddenFilter;
    modifiedAt @UI.Hidden @UI.HiddenFilter;
    modifiedBy @UI.Hidden @UI.HiddenFilter;
};

annotate MainService.Products with {
    name @title : 'Produto'
};
