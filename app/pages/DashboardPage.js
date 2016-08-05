import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { Person } from 'blockstack-profiles'

import { IdentityItem } from '../components/index'
import { IdentityActions } from '../store/identities'
import { AccountActions } from '../store/account'

function mapStateToProps(state) {
  return {
    localIdentities: state.identities.localIdentities,
    lastNameLookup: state.identities.lastNameLookup,
    identityAddresses: state.account.identityAccount.addresses,
    addressLookupUrl: state.settings.api.addressLookupUrl || ''
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Object.assign({}, IdentityActions, AccountActions), dispatch)
}

class DashboardPage extends Component {
  static propTypes = {
    localIdentities: PropTypes.object.isRequired,
    createNewIdentity: PropTypes.func.isRequired,
    refreshIdentities: PropTypes.func.isRequired,
    addressLookupUrl: PropTypes.string.isRequired,
    lastNameLookup: PropTypes.array.isRequired
  }

  constructor(props) {
    super(props)

    this.state = {
      localIdentities: this.props.localIdentities
    }
  }

  componentWillMount() {
    this.props.refreshIdentities(
      this.props.identityAddresses,
      this.props.addressLookupUrl,
      this.props.localIdentities,
      this.props.lastNameLookup
    )
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      localIdentities: nextProps.localIdentities
    })
  }

  render() {
    return (
      <div className="container">
        <section className="container-fluid wrapper">
          <div className="col-sm-6 m-t-2">
            <h4 className="text-xs-center lead-out">My Personas</h4>
              <ul className="bookmarks-temp m-b-11">
              {Object.keys(this.state.localIdentities).map((domainName) => {
                const identity = this.state.localIdentities[domainName],
                      person = new Person(identity.profile)
                if (identity.domainName) {
                  return (
                    <IdentityItem key={identity.domainName}
                      label={identity.domainName}
                      pending={!identity.registered}
                      avatarUrl={person.avatarUrl() || ''}
                      url={`/profile/local/${identity.domainName}`} />
                  )
                }
              })}
              </ul>
            <div>
              <Link to="/names/register" className="btn btn-block btn-primary m-b-11 m-t-2">
                Register
              </Link>
              <Link to="/names/import" className="btn btn-block btn-secondary">
                Import
              </Link>
            </div>
          </div>
          <div className="col-sm-6 m-t-2">
            <h4 className="text-xs-center lead-out">My Apps</h4>
            <div>
              <h4 className="text-xs-center">(no apps installed)</h4>
            </div>
          </div>
        </section>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DashboardPage)